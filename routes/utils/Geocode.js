const NodeGeocoder= require('node-geocoder')
const dotenv = require('dotenv');
dotenv.config({ path: "./config/config.env" });
const options = {
    provider: process.env.GEOCODER_PROVIDER,
    apiKey: process.env.GEOCODER_API_KEY ,
    httpAdapter:'https',// for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
  // console.log(process.env.GEOCODER_PROVIDER,process.env.GEOCODER_API_KEY)

  const geocoder = NodeGeocoder(options);
  module.exports = geocoder;
