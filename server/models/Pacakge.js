const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Package schema
const packageSchema = new Schema({
    packageName: {
        type: String,
        required: true
    },
    packagePrice: {
        type: String,
        required: true
    },
    postsDone: {
        type: String,
    }
});

// Create a model based on the schema
const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
