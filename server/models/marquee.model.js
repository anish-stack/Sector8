const mongoose = require('mongoose');

const marqueeModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true 
    },
   
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Exporting the model
module.exports = mongoose.model('marquee', marqueeModel);
