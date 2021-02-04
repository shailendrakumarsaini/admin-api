const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("./config/connection");
const user = require("./routes/user");
const category = require("./routes/category");
const cookieParser = require('cookie-parser');
const auth = require('./config/auth');

// express.json() is a inbuilt method in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application
app.use(express.json())
// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/user', user);
app.use('/category', category);

// this auth middleware can be used for validation
app.get('/test',auth, (req, res)=>{
    res.send('test page');
});
app.use('/', (req, res)=>{
    res.send('welcome to express app');
}); 

app.listen(port, ()=>{
    console.log(`App listening at http://localhost:${port}`)
})