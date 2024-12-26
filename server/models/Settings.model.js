const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    logo: {
        type: String,
        trim: true
    },
    footerLogo: {
        type: String,
        trim: true,
    },
    BioFooter: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: String,
        trim: true,
    },
    adminId: {
        type: String,
        trim: true
    },
    officeAddress: {
        type: String,
        trim: true
    },
    links: [{
        appName: {
            type: String,

            trim: true
        },
        appLink: {
            type: String,

            trim: true,

        }
    }],
    isFestiveBottomPopUpShow: {
        type: Boolean,
        default: false
    },
    isFestiveTopPopUpShow: {
        type: Boolean,
        default: false
    },
    AboveTopGif: {
        type: String,
        trim: true
    },
    BottomGifLink: {
        type: String,
        trim: true
    },
    GstNo: {
        type: String,
        trim: true,
    },
    FooterEmail: {
        type: String,
        trim: true,

    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Exporting the model
module.exports = mongoose.model('Settings', SettingsSchema);
