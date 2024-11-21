const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const PartnerSchema = new mongoose.Schema({

    PartnerName: {
        type: String,
        required: true
    },
    PartnerEmail: {
        type: String,
        required: true,
        unique: true
    },
    PartnerContactDetails: {
        type: String,
        required: true
    },

    PartnerDoneListing: {
        type: Number,
        default: 0
    },
    Password: {
        type: String,
        required: true
    },
    ResetPasswordOtp: {
        type: String
    },
    AccountVerifyOtp: {
        type: String
    },
    ExpireTimeOtp: {
        type: Date
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// Pre-save middleware to hash the password
PartnerSchema.pre('save', async function (next) {
    if (this.isModified('Password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
    }
    next();
});

// Method to compare password
PartnerSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};

// Create and export the model
const Partner = mongoose.model('Partner', PartnerSchema);

module.exports = Partner;
