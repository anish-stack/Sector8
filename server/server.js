const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ConnectDb = require('./database/Database');
const router = require('./routes/Routes');
const PORT = process.env.PORT || 4255;
const fs = require('fs')
const xlsx = require('xlsx');
const path = require('path')
const filePath = path.resolve(__dirname, 'Services Name .xlsx');
// Load environment variables from .env file
// Read the Excel file
const workbook = xlsx.readFile(filePath);

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get the first sheet
const sheet = workbook.Sheets[sheetName];

const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
// Function to format the data
function formatData(data) {
    const formattedData = [];
  
    data.forEach((row, index) => {
      if (index === 0) return; // Skip header row
  
      if (row.length === 3) {
        const srNo = row[0];
        const testName = row[1];
        const price = row[2];
  
        formattedData.push({
          SrNo: srNo,
          TestName: testName,
          Price: price
        });
      }
    });
  
    return formattedData;
  }

// Format the data
const formattedData = formatData(jsonData);
// Connect to database
ConnectDb();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

app.get('/sheet-data', (req, res) => {
    res.json({ data: formattedData });
});

// Routes
app.get('/', (req, res) => {
    res.send(`I am From Coupons Backend Server Running On Port Number ${PORT}`);
});

app.use('/api/v1', router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Consider restarting the server on critical errors
    process.exit(1); // Restart the server on error
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is Running On Port Number ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server and exit process on unhandled promise rejection
    server.close(() => process.exit(1));
});
