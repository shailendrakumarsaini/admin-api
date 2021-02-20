const mongoose = require("mongoose");

module.exports = ()=> {
    mongoose.connect("mongodb+srv://saini:kumar@cluster0.pdcb8.mongodb.net/admindb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify :false })
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

