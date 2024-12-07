const mongoose = require('mongoose');

const ListingData = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        trim: true
    },
    Details: {
        type: String,
        trim: true
    },
    Pictures: [
        {
            public_id: {
                type: String,
                required: true
            },
            ImageUrl: {
                type: String,
                required: true
            }
        }
    ],
    Items: [
        {
            itemName: {
                type: String,
                trim: true
            },
            MrpPrice: {
                type: String,
            },
            Discount: {
                type: Number,
                min: 0,
                max: 100 // assuming discount is a percentage between 0 and 100
            },
            dishImages: [
                {
                    public_id: {
                        type: String,
                        required: true
                    },
                    ImageUrl: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    ],
    isApprovedByAdmin: {
        type: Boolean,
        default: false
    },
    HtmlContent: {
        type: String,
    },
    tags: [String],
    ShopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopUser",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PostByShop', ListingData);
