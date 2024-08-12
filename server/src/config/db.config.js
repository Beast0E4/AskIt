const mongoose = require('mongoose');
const { ATLAS_DB_URL } = require('./server.config');

async function connectToDb(){
    try{
        await mongoose.connect(ATLAS_DB_URL);
    } catch (error) {
        console.log('Unable to connect to the DB server');
        console.log(error);
    }
}

module.exports = connectToDb;