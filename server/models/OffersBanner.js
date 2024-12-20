const mongoose = require('mongoose');

const OfferBanner = new mongoose.Schema({
    Banner: {
        url: {
            type: String,
            required: true,
        }
    },
    RedirectPageUrl: {
        type: String
    },

    isActive: {
        type: String,
        default: true
    }
}, { timestamps: true });

// Create the Banner model
const Banner = mongoose.model('OfferBanner', OfferBanner);

module.exports = Banner;
