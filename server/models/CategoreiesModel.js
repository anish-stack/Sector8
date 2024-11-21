const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    CategoriesImage:{
        imageUrl:{
            type:String
        },
        public_id:{
            type:String
        }
    },
    CategoriesName:{
        type:String
    },


}, { timestamps: true });

module.exports = mongoose.model('Categories', CategoriesSchema);
