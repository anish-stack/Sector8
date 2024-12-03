const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    PageTitle: {
        type: String,
        required: true, // Ensure PageTitle is mandatory
        trim: true // Removes unnecessary spaces
    },
    MetaTitle: {
        type: String,
        trim: true, // Optional but removes unnecessary spaces
    },
    MetaDescription: {
        type: String,
        trim: true, // Optional and ensures clean data
    },
    content: {
        type: String,
        required: true, // Content should be mandatory
        trim: true // Removes unnecessary spaces
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Exporting the model
module.exports = mongoose.model('Policy', PolicySchema);
