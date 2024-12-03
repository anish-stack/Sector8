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
const axios = require('axios')
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

app.post('/Fetch-Current-Location', async (req, res) => {
  const { lat, lng } = req.body;
console.log(lat,lng)
  // Check if latitude and longitude are provided
  if (!lat || !lng) {
      return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required",
      });
  }

  try {
      // Check if the Google Maps API key is present
      if (!process.env.GOOGLE_MAP_KEY) {
          return res.status(403).json({
              success: false,
              message: "API Key is not found"
          });
      }

      // Fetch address details using the provided latitude and longitude
      const addressResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAP_KEY}`
      );

      // Check if any results are returned
      if (addressResponse.data.results.length > 0) {
          const addressComponents = addressResponse.data.results[0].address_components;
          // console.log(addressComponents)

          let city = null;
          let area = null;
          let postalCode = null;
          let district = null;

          // Extract necessary address components
          addressComponents.forEach(component => {
              if (component.types.includes('locality')) {
                  city = component.long_name;
              } else if (component.types.includes('sublocality_level_1')) {
                  area = component.long_name;
              } else if (component.types.includes('postal_code')) {
                  postalCode = component.long_name;
              } else if (component.types.includes('administrative_area_level_3')) {
                  district = component.long_name; // Get district
              }
          });

          // Prepare the address details object
          const addressDetails = {
              completeAddress: addressResponse.data.results[0].formatted_address,
              city: city,
              area: area,
              district: district,
              postalCode: postalCode,
              landmark: null, // Placeholder for landmark if needed
              lat: addressResponse.data.results[0].geometry.location.lat,
              lng: addressResponse.data.results[0].geometry.location.lng,
          };

          console.log("Address Details:", addressDetails);

          // Respond with the location and address details
          return res.status(200).json({
              success: true,
              data: {
                  location: { lat, lng },
                  address: addressDetails,
              },
              message: "Location fetch successful"
          });
      } else {
          return res.status(404).json({
              success: false,
              message: "No address found for the given location",
          });
      }
  } catch (error) {
      console.error('Error fetching address:', error);
      return res.status(500).json({
          success: false,
          message: "Failed to fetch address",
      });
  }
});


app.get('/autocomplete', async (req, res) => {
    try {
        const { input } = req.query;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
            {
                params: {
                    input,
                    radius: 500,
                    key: process.env.GOOGLE_MAP_KEY
                }
            }
        );
        res.json(response.data.predictions);
    } catch (error) {
        console.error('Error making Google API request:', error);
        res.status(500).send('Server error');
    }
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
