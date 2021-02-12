require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const cors = require('cors');


const connection = require("./config/connection");
const auth = require('./config/auth');
const user = require("./routes/user.route");
const category = require("./routes/category.route");
const course = require('./routes/course.route');

connection();
app.use(cors())
// express.json() is a inbuilt method in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application
app.use(express.json())
// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/user', user);
app.use('/category', category);
app.use('/course', course);
// this auth middleware can be used for validation
app.get('/dashboard',auth, (req, res)=>{
    res.send('dashboard page loded');
});


//404 handler and pass to error handler
app.use((req, res, next) => {
    /*
    const err = new Error('Not found');
    err.status = 404;
    next(err);
    */
    // You can use the above code if your not using the http-errors module
    next(createError(404, 'Not found'));
});

//Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      // error: {
        status: err.status || 500,
        message: err.message
      // }
    });
});

const PORT  = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`App listening at http://localhost:${PORT}`)
})