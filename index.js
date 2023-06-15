const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config({path:"./config/config.env"})

const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`Server started in ${process.env.NODE_ENV} on port ${port}`);
})