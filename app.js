// Build your own command line app of your choice
require('dotenv').config();

const apiKey = process.env.API_KEY;
// console.log(apiKey);

const date = '2025-12-25';
const [year, month, day] = date.split('-');

// Require https module
const https = require('https');

function getHolidays(countryCode) {
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
          // Parse data
          const holidays = JSON.parse(body);
          // Print data
          console.log(holidays);
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
