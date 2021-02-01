const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("./config/connection");
const router = express.Router();
const user = require("./routes/user");

app.use('/user', user);


app.listen(port, ()=>{
    console.log(`App listening at http://localhost:${port}`)
})