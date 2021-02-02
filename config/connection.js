const mongoose = require("mongoose");
const config = require("./config");

mongoose.connect(config.db.urlDev, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify :false })
    .then(()=>{
        console.log('DB Connection Successfully');
    })
    .catch(()=>{
        console.log('DB Connection Failed');
    });