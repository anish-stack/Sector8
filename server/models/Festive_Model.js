const mongoose = require('mongoose');

const Festive_Schema = new mongoose.Schema({
    Banner: {
        url: {
            type: String,
            required: true,
        }
    },
    ButtonText: {
        type: String,
    },
    Para: {
        type: String,
    },
    RedirectPageUrl: {
        type: String
    },
    onWhicPage: {
        type: String,
        default: 'home'
    },
    dealy: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Exporting the model
module.exports = mongoose.model('festive', Festive_Schema);
