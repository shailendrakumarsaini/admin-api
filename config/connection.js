const mongoose = require("mongoose");
const config = require('../config/config.json');

module.exports = ()=> {
    console.log(config.MONGODB_URI_LIVE);
    mongoose.connect(config.MONGODB_URI_LIVE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify :false })
    // mongoose.connect(config.MONGODB_URI_LIVE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify :false })
    .then(()=>{
        console.log('Mongodb Successfully connected....');
    })
    .catch(()=>{
        console.log('Mongodb Connection failed');
    });

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to db...');
      });
    
    mongoose.connection.on('error', err => {
    console.log(err.message);
    });

    mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log(
            'Mongoose connection is disconnected due to app termination...'
            );
            process.exit(0);
        });
    });
}

