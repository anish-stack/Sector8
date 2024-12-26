const mongoose = require('mongoose');

const free_space_page = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    MainImage: {
        type: String
    },
    HtmlContent: {
        type: String
    },
    isContentShow: {
        type: Boolean,
        default: true
    },
    isButton: {
        type: Boolean,
        default: false
    },
    buttonText: {
        type: String
    },
    buttonLink: {
        type: String
    },
    b1:{
        type: String
    },
    b2:{
        type: String
    }

})

module.exports = mongoose.model('free_space_page', free_space_page);