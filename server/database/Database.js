const mongoose = require('mongoose');

const ConnectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database is connecting Successful')
    } catch (error) {
        console.error('Error In Connecting Database',error)
    }
}

module.exports = ConnectDb