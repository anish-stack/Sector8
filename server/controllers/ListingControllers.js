const Listing = require('../models/listing.model');
const Partner = require('../models/Partner.model');
const Cloudinary = require('cloudinary').v2;
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/SendEmail');
const ListingUser = require('../models/User.model')
const dotenv = require('dotenv')
dotenv.config()
Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.envCLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

exports.CreateListing = async (req, res) => {
    try {
        console.log("i am hit")
        const ShopId = req.user.id;
        const CoverImages = req.files['images'];
        const itemsImages = req.body['Items'];
        console.log("Items", itemsImages)
        console.log("CoverImages", CoverImages)
        if (!ShopId) {
            return res.status(401).json({
                success: false,
                msg: "Please Login"
            });
        }

        const CheckMyShop = await ListingUser.findById(ShopId).select('-Password');
        const { ListingPlan, HowMuchOfferPost } = CheckMyShop;
        const planLimits = {
            Free: 1,
            Silver: 5,
            Gold: 10
        };

        if (HowMuchOfferPost >= planLimits[ListingPlan]) {
            return res.status(403).json({
                success: false,
                msg: `You have reached the post limit for your ${ListingPlan} plan. Please upgrade your plan.`
            });
        }

        const { Title, Details } = req.body;

        const Items = [];
        for (let i = 0; req.body[`Items[${i}].itemName`] !== undefined; i++) {
            Items.push({
                itemName: req.body[`Items[${i}].itemName`],
                Discount: req.body[`Items[${i}].Discount`]
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const uploadImage = (file) => {
            return new Promise((resolve, reject) => {
                const stream = Cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve({ public_id: result.public_id, ImageUrl: result.secure_url });
                    } else {
                        reject(error);
                    }
                });
                stream.end(file.buffer);
            });
        };

        const images = req.files['images'] || [];
        const dishImages = req.files['dishImages'] || [];

        const uploadedImages = await Promise.all(images.map(file => uploadImage(file)));
        const uploadedDishImages = await Promise.all(dishImages.map(file => uploadImage(file)));

        uploadedDishImages.forEach((upload, index) => {
            Items[index].Image = upload.secure_url;
            Items[index].public_id = upload.public_id;
        });

        const newPost = await Listing.create({
            Title,
            Details,
            Items,
            Pictures: uploadedImages,
            ShopId
        });

        CheckMyShop.HowMuchOfferPost += 1;
        await CheckMyShop.save();

        res.status(201).json({
            success: true,
            msg: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error creating post",
            error: error.message
        });
    }
};
exports.getAllListing = async (req, res) => {
    try {
        const listings = await Listing.find(); // Fetch all listings from the database

        if (listings.length === 0) {
            return res.status(402).json({
                success: false,
                message: 'No listings found.',
            });
        }

        return res.status(200).json({
            success: true,
            count: listings.length,
            data: listings,
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error. Could not fetch listings.',
        });
    }
};
exports.deleteListingById = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        // Delete associated images from Cloudinary
        const deleteImage = async (public_id) => {
            return Cloudinary.uploader.destroy(public_id);
        };

        await Promise.all(listing.Pictures.map(pic => deleteImage(pic.public_id)));

        await listing.remove();
        res.status(200).json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.deleteAllListings = async (req, res) => {
    try {
        const listings = await Listing.find();

        if (listings.length === 0) {
            return res.status(404).json({ success: false, message: 'No listings found to delete' });
        }

        // Delete associated images from Cloudinary
        const deleteImage = async (public_id) => {
            return Cloudinary.uploader.destroy(public_id);
        };

        await Promise.all(
            listings.flatMap(listing => listing.Pictures.map(pic => deleteImage(pic.public_id)))
        );

        await Listing.deleteMany();
        res.status(200).json({ success: true, message: 'All listings deleted successfully' });
    } catch (error) {
        console.error('Error deleting all listings:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.status(200).json({ success: true, data: listing });
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const stream = Cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve({ public_id: result.public_id, ImageUrl: result.secure_url });
            } else {
                reject(error);
            }
        });
        stream.end(file.buffer);
    });
};
exports.UpdateListing = async (req, res) => {
    try {
        const ShopId = req.user.id;
        const ListingId = req.params.id;

        if (!ShopId) {
            return res.status(401).json({
                success: false,
                msg: "Please Login"
            });
        }

        const CheckMyShop = await ListingUser.findById(ShopId).select('-Password');
        if (!CheckMyShop) {
            return res.status(404).json({
                success: false,
                msg: "Shop not found"
            });
        }

        const { Title, Details } = req.body;

        const listing = await Listing.findById(ListingId);
        if (!listing) {
            return res.status(404).json({
                success: false,
                msg: "Listing not found"
            });
        }

        if (listing.ShopId.toString() !== ShopId) {
            return res.status(403).json({
                success: false,
                msg: "Unauthorized"
            });
        }

        const Items = [];
        for (let i = 0; req.body[`Items[${i}].itemName`] !== undefined; i++) {
            Items.push({
                itemName: req.body[`Items[${i}].itemName`],
                MrpPrice: req.body[`Items[${i}].MrpPrice`],
                Discount: req.body[`Items[${i}].Discount`],
                dishImages: []
            });
        }

        console.log('Items before adding images:', Items);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const images = req.files['images'] || [];
        const dishImagesUrl = req.files.map(file => file);

        console.log('dishImagesUrl:', dishImagesUrl);

        const uploadedDishImages = await Promise.all(dishImagesUrl.map(file => uploadImage(file)));

        console.log('uploadedDishImages:', uploadedDishImages);

        uploadedDishImages.forEach((upload, index) => {
            if (Items[index]) {
                Items[index].dishImages.push({
                    public_id: upload.public_id,
                    ImageUrl: upload.ImageUrl
                });
            }
        });

        const uploadedImages = await Promise.all(images.map(file => uploadImage(file)));

        console.log('uploadedImages:', uploadedImages);

        if (Title) listing.Title = Title;
        if (Details) listing.Details = Details;
        if (Items.length) listing.Items = Items;

        if (uploadedImages.length) {
            const updatedPictures = [...listing.Pictures];

            uploadedImages.forEach(upload => {
                const existingImageIndex = updatedPictures.findIndex(picture => picture.public_id === upload.public_id);
                if (existingImageIndex !== -1) {
                    updatedPictures[existingImageIndex] = upload;
                } else {
                    updatedPictures.push({
                        public_id: upload.public_id,
                        ImageUrl: upload.ImageUrl
                    });
                }
            });

            listing.Pictures = updatedPictures;

            console.log('Updated Pictures:', updatedPictures);
        }

        await listing.save();

        res.status(200).json({
            success: true,
            msg: "Listing updated successfully",
            listing
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Error updating listing",
            error: error.message
        });
    }
};


exports.getPostByCategory = async (req, res) => {
    try {
        const { Name } = req.params;
        // console.log(Name)
        // Fetch all listings by category
        const listings = await ListingUser.find({ ShopCategory: Name });
        console.log(listings.length)
        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: 'No listings found for this category' });
        }

        // Fetch and process posts for each listing
        const postsPromises = listings.map(async (listing) => {
            // Fetch posts for the current listing
            console.log(listing)
            const posts = await Listing.find({ ShopId: listing._id }).sort({ createdAt: -1 });

            // Attach plan information to each post
            const postsWithPlan = posts.map(post => ({
                ...post.toObject(), 
                Plan: listing?.ListingPlan 
            }));

            return postsWithPlan;
        });

        // Wait for all post fetching operations to complete
        let postsArrays = await Promise.all(postsPromises);
        console.log(postsArrays)
        // Flatten the array of arrays into a single array of posts
        let posts = postsArrays.flat();
        console.log(posts.length)
        // Separate posts by listing plan
        const goldPosts = posts.filter(post => post.Plan === 'Gold');
        const silverPosts = posts.filter(post => post.Plan === 'Silver');
        const freePosts = posts.filter(post => post.Plan === 'Free');

        // Shuffle function
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        // Shuffle posts within each plan category
        shuffle(goldPosts);
        shuffle(silverPosts);
        shuffle(freePosts);

        // Combine posts with priority: Gold, Silver, Free
        const combinedPosts = [...goldPosts, ...silverPosts, ...freePosts];

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};