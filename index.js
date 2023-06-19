const express = require('express');
const dotenv = require('dotenv');
const app = express();
//import routes from routes folder from bootcamps.js
const bootcamp = require('./routes/bootcamps');

let temp = dotenv.config({ path: "./config/config.env" })


app.use('/api/v1/bootcamps', bootcamp);



const port = process.env.PORT || 5000;
console.log(temp)

app.listen(port, () => {
    console.log(`Server started in ${process.env.NODE_ENV} on port ${port}`);
})