const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("./config/connection");
const user = require("./routes/user");

// express.json() is a inbuilt method in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application
app.use(express.json())
// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }))


app.use('/user', user);
app.use('/', (req, res)=>{
    res.send('welcome to express app');
}); 

app.listen(port, ()=>{
    console.log(`App listening at http://localhost:${port}`)
})