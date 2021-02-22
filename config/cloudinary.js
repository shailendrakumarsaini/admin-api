const cloudinary = require('cloudinary');
const config = require('./config.json');

cloudinary.config({ 
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_ID,
  api_secret: config.API_SECRET
})

// cloudinary.config({ 
//   cloud_name: config.CLOUD_NAME,
//   api_key: config.API_ID,
//   api_secret: config.API_SECRET
// })