const express = require('express');
const dotenv = require('dotenv');
const app = express();
const connectDB= require('./config/db.js');
const errorHandler = require('./middleware/error.js');
//import routes from routes folder from bootcamps.js
const bootcamp = require('./routes/bootcamps');
const courses = require('./routes/courses');
const Authenticate=require('./routes/Auth.js');
const users=require('./routes/users.js');
const reviews = require('./routes/Reviews.js');
const mongoSanitize = require('express-mongo-sanitize');
const cookieparser=require('cookie-parser');
const xss = require('xss-clean')
//importing middleware from middleware.js file
const middleware_example= require('./middleware/middleware');
const expressFileUpload=require('express-fileupload');
const path= require('path');

let temp = dotenv.config({ path: "./config/config.env" })

connectDB();

//providing the middleware to entire application
app.use(middleware_example);

//Body Parser 
app.use(express.json())

//mount our cookie parser package to our application
app.use(cookieparser());


//providing access to express-fileUpload Middleware
app.use(expressFileUpload());

//sanitize the inputs as middleware for neglecting the SQL injection
app.use(
    mongoSanitize({
      onSanitize: ({ req, key }) => {
        console.log(`This request[${key}] is sanitized`, req);
      },
    }),
  );

// use xss (cross site scripting) to prevent CSRF attacks and security vulnerabilities
app.use(xss());

//setting our public folder as a static folder
app.use(express.static(path.join(__dirname,'public')));

//mount our routers 
app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth',Authenticate);
app.use('/api/v1/auth/users',users);
app.use('/api/v1/reviews',reviews);

//provide our error handler middleware to our application
app.use(errorHandler);

//providing access to express-fileUpload Middleware
app.use(expressFileUpload());

const port = process.env.PORT || 5000;

const server=app.listen(port, () => {
    console.log(`Server started in ${process.env.NODE_ENV} on port ${port}`);
})

//handle Unhandled promise rejections

// process.on('unhandledRejection',(err, promise) => {
//     //close server & exit process
//     server.close(()=>process.exit(1));
// });