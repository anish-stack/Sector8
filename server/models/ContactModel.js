const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    PhoneNumber: {
        type: String,
        required: true,
        trim: true,

    },
    Email: {
        type: String,
        required: true,
        trim: true,

    },
    Subject: {
        type: String,
        required: true,
        trim: true
    },
    Message: {
        type: String,
        required: true,
        trim: true
    },
    readIt: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Exporting the model
module.exports = mongoose.model('Contact', ContactSchema);
