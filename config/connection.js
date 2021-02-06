const mongoose = require("mongoose");
const config = require("./config");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify :false })
    .then(()=>{
        console.log('DB Connection Successfully');
    })
    .catch(()=>{
        console.log('DB Connection Failed');
    });