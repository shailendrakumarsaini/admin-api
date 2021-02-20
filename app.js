require('dotenv').config()
const express = require("express");
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const cors = require('cors');
require('./config/cloudinary');

const connection = require("./config/connection");
const auth = require('./config/auth');
const user = require("./routes/user.route");
const category = require("./routes/category.route");
const course = require('./routes/course.route');

const app = express();
connection();
const corsOptions = {
  origin: 'https://admin-host.herokuapp.com',
  credentials: true
}
app.use(cors(corsOptions));
// express.json() is a inbuilt method in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application
app.use(express.json())
// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/user', user);
app.use('/category', auth, category);
app.use('/course', auth, course);
// this auth middleware can be used for validation
app.get('/dashboard',auth, (req, res)=>{
    res.json({success : false, message : 'Dashboard Page Loaded' });
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
    // console.error(err.message);
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
  console.log(`App listening at port : ${PORT}`);
  console.log(`MONGODB_URI_LIVE : ${process.env.MONGODB_URI_LIVE}`);
  console.log(`SECRET_KEY : ${process.env.SECRET_KEY}`);
  console.log(`CLOUD_NAME : ${process.env.CLOUD_NAME}`);
  console.log(`API_ID : ${process.env.API_ID}`);
  console.log(`API_SECRET : ${process.env.API_SECRET}`);
})