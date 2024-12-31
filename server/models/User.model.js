const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ListingUserSchema = new mongoose.Schema({
    ProfilePic:{
        type:String
    },
    UserName: {
        type: String,
        required: [true, "Please provide a User Name"]
    },
    ShopName: {
        type: String,
        required: [true, "Please provide a Shop Name"]
    },
    ContactNumber: {
        type: String
    },
    Email: {
        type: String,
    },
    ShopAddress: {
        City: {
            type: String,
        },
        PinCode: {
            type: String,
            required: [true, "Please provide a PinCode"]
        },
        ShopNo: {
            type: String,
            required: [true, "Please provide a Shop Number"]
        },
        ShopAddressStreet: {
            type: String,
            required: [true, "Please provide a Shop Address"]
        },
        NearByLandMark: {
            type: String,
            required: [true, "Please provide a Nearby Landmark"]
        },
        Location: {
            type: {
                type: String, 
                enum: ['Point'], 
                required: true
            },
            coordinates: {
                type: [Number], 
                required: true
            }
        }
    },
    ShopCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
    },
    LandMarkCoordinates: {
        type: {
            type: String, // Must be "Point"
            enum: ['Point'], // Restrict to "Point" only
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers for [longitude, latitude]
            required: true
        }
    },

    BussinessHours:{
        openTime:{
            type: String,
         
        },
        closeTime:{
            type: String,
        },
        offDay:{
            type: String,
        },
    },

    

    HowMuchOfferPost: {
        type: Number,
    },
    Password: {
        type: String,
        required: [true, "Please provide a Password"]
    },
    ListingPlan:{
        type: String,
        required: [true, "Please provide Listing Plan"]
    },
    PasswordChangeOtp: {
        type: String
    },
    OtpExipredTme: {
        type: Date
    },
    newPassword: {
        type: String
    },
    PackageId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
    },
    Post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostByShop",
    },
    FreeListing: {
        type: String,
    },
    OrderId: {
        type: String,
    },
    PaymentDone: {
        type: Boolean,
        default: false
    },
    PackagePlanIssued:{
        type: Number,
    },
    isUpdatedProfile:{
        type:Boolean,
    },
    PartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
    }
}, { timestamps: true });

// Add 2dsphere index to the Location field
ListingUserSchema.index({ 'ShopAddress.Location': '2dsphere' });
ListingUserSchema.index({ 'LandMarkCoordinates': '2dsphere' });


ListingUserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('Password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(user.Password, 10);
        user.Password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare passwords
ListingUserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};

const ListingUser = mongoose.model('ShopUser', ListingUserSchema);

module.exports = ListingUser;
