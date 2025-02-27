const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

// Add debugging for environment variables
console.log('Environment variables:');
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID);
console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'is set (hidden)' : 'not set');

// Auth0 credentials (store these in a .env file for security)
const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const audience = `https://${domain}/api/v2/`;

// Path to your CSV file - update with the correct filename
const csvFilePath = '../data/customer_logins.csv';

// Check if the CSV file exists before proceeding
try {
  if (fs.existsSync(csvFilePath)) {
    console.log(`CSV file found at: ${csvFilePath}`);
  } else {
    console.error(`CSV file not found at: ${csvFilePath}`);
    console.log('Current working directory:', process.cwd());
    process.exit(1);
  }
} catch (err) {
  console.error('Error checking for CSV file:', err);
  process.exit(1);
}

// Function to get an access token
async function getAccessToken() {
  try {
    const response = await axios.post(`https://${domain}/oauth/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      grant_type: 'client_credentials'
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create a user
async function createUser(token, userData) {
  try {
    const response = await axios.post(`https://${domain}/api/v2/users`, {
      connection: 'amazon-tracker-database', // Default Auth0 DB connection name
      email: `${userData.Username}@example.com`, // Creating a fake email based on username
      password: userData.Password,
      username: userData.Username,
      name: userData.Username, // Setting the name field to the username
      user_metadata: {
        customer_id: userData['Customer ID']
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`User created: ${userData.Username}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating user ${userData.Username}:`, error.response?.data?.message || error.message);
    // Continue with other users even if one fails
    return null;
  }
}

// Main function to process the CSV and create users
async function importUsers() {
  try {
    // Get access token
    const token = await getAccessToken();
    
    // Process CSV file
    const users = [];
    
    // Read and parse the CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => users.push(data))
      .on('end', async () => {
        console.log(`Processing ${users.length} users from CSV...`);
        
        // Create users sequentially to avoid rate limits
        for (const userData of users) {
          await createUser(token, userData);
          // Add a small delay between requests to avoid hitting rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('User import completed!');
      });
      
  } catch (error) {
    console.error('Error in import process:', error);
  }
}

// Run the import
importUsers();