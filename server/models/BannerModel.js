const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  
    image: {
        url: {
            type: String,
            required: true // Ensure the image URL is mandatory
        },
        public_id: {
            type: String,
            required: true // Ensure the public_id is mandatory
        }
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Exporting the model
module.exports = mongoose.model('Banner', BannerSchema);
