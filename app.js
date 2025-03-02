// Build your own command line app of your choice
require('dotenv').config();

const apiKey = process.env.API_KEY;

const date = new Date().toISOString().slice(0, 10);
const [year, month, day] = date.split('-');

// Require https module
const https = require('https');

const fs = require('fs');

const countryCodes = JSON.parse(
  fs.readFileSync('country-codes.json', 'utf-8')
);

function getHolidays(countryCode) {
  const countryName = countryCodes[countryCode];

  try {
    // Request data
    const request = https.get(
      `https://holidays.abstractapi.com/v1/?api_key=${apiKey}&country=${countryCode}&year=${year}&month=${month}&day=${day}`,
      (response) => {
        let body = '';
        // Read data
        response.on('data', (data) => {
          body += data.toString();
        });

        response.on('end', () => {
          try {
            // Parse data
            const holidays = JSON.parse(body);

            if (!holidays.length) {
              console.log(
                'Today is not a holiday in ${countryName}.'
              );
              return;
            }

            const holidayNames = holidays
              .map((holiday) => holiday.name)
              .join(', ');
            // Print data
            console.log(
              `Today is ${holidayNames} in ${countryName}.`
            );
          } catch (error) {
            console.error(error.message);
          }
        });
      }
    );
    request.on('error', (error) => console.error(error.message));
  } catch (error) {
    console.error(error.message);
  }
}

const query = process.argv.slice(2);
query.forEach(getHolidays);
