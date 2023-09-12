const dotenv = require('dotenv');
const fs = require('fs');
const bootcamps = require('./models/bootcamps');
const courses = require('./models/courses');
const Users=require('./models/Users');
const Reviews = require('./models/Reviews');
const mongoose = require('mongoose');

//load environment variables .env configuration file
dotenv.config({ path: "./config/config.env" });

//connecting to database 
mongoose.connect(process.env.MONGO_URI);


const seedBootcampFiles = async () => {
    try {
        await bootcamps.create((JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`), 'utf8')));
        await courses.create((JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`), 'utf8')));
        await Users.create((JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`), 'utf8')));
        await Reviews.create((JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`), 'utf8')));
        console.log('File has been processed and posted to Database');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}
const deleteBootcampFiles = async () => {
    try {
        await bootcamps.deleteMany();
        await courses.deleteMany();
        await Users.deleteMany();
        await Reviews.deleteMany();
        console.log('File has been deleted from  Database');
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if (process.argv[2] === '-i') {
    seedBootcampFiles();
}
else if (process.argv[2] === '-d') {
    deleteBootcampFiles();
}
