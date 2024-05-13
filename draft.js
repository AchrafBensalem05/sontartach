const sql = require('mssql');
const axios = require('axios');

// Configure database connection
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
  options: {
    encrypt: true, // Use encryption (if required)
    enableArithAbort: true // Enable ArithAbort (if required)
  }
};

// Function to connect to SQL Server and fetch data
async function fetchDataAndSendRequests() {
  try {
    // Create a new connection pool
    const pool = await sql.connect(config);

    // Query to fetch data from a specific table
    const query = 'SELECT * FROM your_table';

    // Execute the query
    const result = await pool.request().query(query);

    // Process the fetched data
    const data = result.recordset;

    // Loop through each data item and send an HTTP request
    for (const item of data) {
      const requestData = {
        // Construct your request data here using the item properties
        // For example:
        // id: item.id,
        // name: item.name,
        // otherData: item.otherData
      };

      // Send an HTTP request using axios (or any other HTTP client)
      const response = await axios.post('http://your-api-endpoint', requestData);
      
      // Log the response (optional)
      console.log(response.data);
    }

    // Close the connection pool
    await pool.close();
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

// Call the fetchDataAndSendRequests function
fetchDataAndSendRequests();
