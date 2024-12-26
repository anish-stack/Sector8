const Listing = require('../models/listing.model');
const Partner = require('../models/Partner.model');
const Cloudinary = require('cloudinary').v2;
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/SendEmail');
const mongoose = require('mongoose')
const ListingUser = require('../models/User.model')
const dotenv = require('dotenv');
const Package = require('../models/Pacakge');
dotenv.config()
Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.envCLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

exports.CreateListing = async (req, res) => {
    try {

        const ShopId = req.user.id;


        if (!ShopId) {
            return res.status(401).json({
                success: false,
                msg: "Please Login"
            });
        }

        const CheckMyShop = await ListingUser.findById(ShopId).select('-Password');
        const { ListingPlan, HowMuchOfferPost } = CheckMyShop;

        const Plans = await Package.findOne({
            packageName: ListingPlan
        })

        if (HowMuchOfferPost >= Plans?.postsDone) {
            return res.status(403).json({
                success: false,
                msg: `You have reached the post limit for your ${ListingPlan} plan. Please upgrade your plan.`
            });
        }


        const { Title, Details, HtmlContent } = req.body;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }


        const Items = [];

        // Process Items and their dishImages
        const itemsMap = {};
        req.files.forEach(file => {
            const match = file.fieldname.match(/Items\[(\d+)\]\.dishImages\[(\d+)\]/);
            if (match) {
                const [_, itemIndex, imageIndex] = match;
                if (!itemsMap[itemIndex]) {
                    itemsMap[itemIndex] = { dishImages: [] };
                }
                itemsMap[itemIndex].dishImages.push(file);
            }
        });

        // Upload images to Cloudinary
        const uploadToCloudinary = async (file) => {
            return new Promise((resolve, reject) => {
                Cloudinary.uploader.upload_stream({
                    folder: 'your_upload_folder' // Adjust folder as per your setup
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ public_id: result.public_id, ImageUrl: result.secure_url });
                    }
                }).end(file.buffer);
            });
        };

        // Process items with dishImages
        for (const index of Object.keys(itemsMap)) {
            const item = itemsMap[index];
            const uploadedImages = await Promise.all(item.dishImages.map(file => uploadToCloudinary(file)));
            Items.push({
                itemName: req.body[`Items[${index}].itemName`],
                MrpPrice: req.body[`Items[${index}].MrpPrice`],
                Discount: req.body[`Items[${index}].Discount`],
                dishImages: uploadedImages
            });
        }


        const newPost = await Listing.create({
            Title,
            Details,
            Items,
            HtmlContent,
            Pictures: uploadedGeneralImages,
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
        console.log(error)
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

        console.log(req.body);

        const CheckMyShop = await ListingUser.findById(ShopId).select('-Password');
        if (!CheckMyShop) {
            return res.status(404).json({
                success: false,
                msg: "Shop not found"
            });
        }

        const { Title, Details, HtmlContent, tags } = req.body;

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

        // Initialize the Items array
        const Items = [];
        for (let i = 0; req.body[`Items[${i}].itemName`] !== undefined; i++) {
            Items.push({
                itemName: req.body[`Items[${i}].itemName`],
                MrpPrice: req.body[`Items[${i}].MrpPrice`],
                Discount: req.body[`Items[${i}].Discount`],
                dishImages: []  // Initialize an empty array for dish images
            });
        }

        console.log('Items before adding images:', req.files);

        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Handle image upload (for multiple files)
        if (req.files && req.files.length > 0) {
            // Assuming `req.files` is an array of uploaded images
            let imageIndex = 0; // Track the image index for matching images to items
            const uploadedDishImages = await Promise.all(req.files.map(upload => uploadImage(upload)));

            uploadedDishImages.forEach((upload, index) => {
                // Ensure that image is added to the corresponding item
                if (Items[imageIndex]) {
                    Items[imageIndex].dishImages.push({
                        public_id: upload.public_id,
                        ImageUrl: upload.ImageUrl
                    });
                }
                imageIndex++; // Increment to the next item
            });
        }
        const splitTags = tags.split(',').map(tag => tag.trim());
        console.log(splitTags);
        // Update the listing with new data
        if (Title) listing.Title = Title;
        if (Details) listing.Details = Details;
        if (HtmlContent) listing.HtmlContent = HtmlContent; // Update HtmlContent if it exists
        if (splitTags) listing.tags = splitTags; // Update tags if it exists
        if (Items.length) listing.Items = Items;

        listing.isApprovedByAdmin = false

        await listing.save();

        // Send success response
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

exports.UpdateListingByBolt = async (req, res) => {
    try {
        const listingId = req.query.ListingId;
        const ShopId = req.query.id;

        // console.log("Received request to update listing...");
        // console.log("Listing ID:", listingId);
        // console.log("Shop ID:", ShopId);

        if (!ShopId) {
            console.log("No Shop ID provided. Returning error.");
            return res.status(401).json({
                success: false,
                msg: "Please Login",
            });
        }

        // Check if listing exists and belongs to the shop
        const existingListing = await Listing.findOne({ _id: listingId, ShopId });
        if (!existingListing) {
            console.log("Listing not found or unauthorized.");
            return res.status(404).json({
                success: false,
                msg: "Listing not found or unauthorized",
            });
        }

        const { Title, Details, HtmlContent, ItemsUpdated } = req.body;
        // console.log("Request body:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Check if files are provided
        // console.log("Files received:", req.files);

        // If files are not provided, initialize filesArray as an empty array
        const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        console.log("Files array after handling:", filesArray);

        if (filesArray.length === 0) {
            console.log("No files to upload.");
        }

        // Handle dish images
        const itemsMap = {};
        filesArray.forEach((file) => {
            const fieldName = file.fieldname;
            // console.log("Processing file:", file);
            if (fieldName.startsWith("dishImages")) {
                const itemIndex = fieldName.split("[")[1].split("]")[0];
                // console.log("itemIndex for dish image:", itemIndex);
                itemsMap[itemIndex] = itemsMap[itemIndex] || { dishImages: [] };
                itemsMap[itemIndex].dishImages.push(file);
            }
        });

        // Helper function to upload to Cloudinary
        const uploadToCloudinary = async (file) => {
            return new Promise((resolve, reject) => {
                console.log("Uploading to Cloudinary:", file);
                Cloudinary.uploader.upload_stream(
                    { folder: "your_upload_folder" },
                    (error, result) => {
                        if (error) {
                            console.log("Cloudinary upload error:", error);
                            reject(error);
                        } else {
                            console.log("Cloudinary upload result:", result);
                            resolve({ public_id: result.public_id, ImageUrl: result.secure_url });
                        }
                    }
                ).end(file.buffer);
            });
        };

        // Handle updated items
        const updatedItems = JSON.parse(ItemsUpdated);
        const updatedListingItems = [];

        // console.log("Updated items received:", updatedItems);

        for (const [index, item] of Object.entries(updatedItems)) {
            const existingItem = existingListing.Items[index]; // Get the existing item at this index

            // console.log("Processing item:", item);
            // console.log("Existing item:", existingItem);

            // Handle dish images (upload new ones if provided, keep existing ones if not)
            let dishImages = [];

            console.log("Dish images found for item:", req.files);
            if (item.dishImages && item.dishImages.length > 0) {
                // Only upload valid dish images
                dishImages = await uploadToCloudinary(req.files[0]);
                // dishImages = await Promise.all(item.dishImages.map(async (image) => {
                //     if (image && image.buffer) {
                //         return await uploadToCloudinary(image);
                //     } else {
                //         console.log("Invalid dish image data:", image);
                //         return null; // Ignore invalid images
                //     }
                // }));
            } else {
                // If no new dish images are provided, keep the existing images
                dishImages = existingItem?.dishImages || []; // Preserve existing images
            }

            // Update the item with either the new values or the existing ones
            updatedListingItems.push({
                itemName: item.itemName || existingItem?.itemName,
                MrpPrice: item.MrpPrice || existingItem?.MrpPrice,
                Discount: item.Discount || existingItem?.Discount,
                dishImages, // Updated dish images (keeps existing ones if none are uploaded)
            });
        }

        // Handle general pictures update
        let updatedPictures = existingListing.Pictures;
        const pictureFiles = filesArray.filter((file) => file.fieldname === "MainImage");

        if (pictureFiles.length > 0) {
            console.log("Main image files found, uploading...");
            updatedPictures = await Promise.all(pictureFiles.map(uploadToCloudinary));
        } else {
            console.log("No main image files provided.");
        }

        // Update the listing
        const updatedListing = await Listing.findByIdAndUpdate(
            listingId,
            {
                Title: Title || existingListing.Title,
                Details: Details || existingListing.Details,
                HtmlContent: HtmlContent || existingListing.HtmlContent,
                Items: updatedListingItems.length > 0 ? updatedListingItems : existingListing.Items,
                Pictures: updatedPictures,
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true }
        );

        console.log("Listing updated successfully.");

        return res.status(200).json({
            success: true,
            msg: "Listing updated successfully",
            listing: updatedListing,
        });
    } catch (error) {
        console.error("Error during update:", error);
        return res.status(500).json({
            success: false,
            msg: "Error updating listing",
            error: error.message,
        });
    }
};



exports.updateImage = async (req, res) => {
    try {
        const { publicId } = req.query; // Get publicId of the image to replace
        const imageFile = req.file; // New image file from the request

        // Validate inputs
        if (!publicId || !imageFile) {
            return res.status(400).json({ error: 'Missing required parameters: publicId or image file.' });
        }

        // Find the listing containing the old image
        const listing = await Listing.findOne({
            Pictures: { $elemMatch: { public_id: publicId } }
        });

        if (!listing) {
            return res.status(404).json({ error: 'Image not found in the database.' });
        }

        // Delete old image from Cloudinary
        await Cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                throw new Error('Failed to delete old image from Cloudinary.');
            }
        });

        // Upload new image to Cloudinary
        const newImage = await uploadImage(imageFile);

        // Update the image details in the database
        const updatedPictures = listing.Pictures.map((picture) =>
            picture.public_id === publicId ? newImage : picture
        );

        listing.Pictures = updatedPictures;
        listing.isApprovedByAdmin = false
        await listing.save();

        res.status(200).json({
            message: 'Image updated successfully!',
            listing,
        });
    } catch (error) {
        console.error('Error updating image:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the image.' });
    }
};



exports.UpdateListingAdmin = async (req, res) => {
    try {
        const ShopId = req.query.id;
        const ListingId = req.query.ListingId;

        if (!ShopId) {
            return res.status(401).json({
                success: false,
                msg: "Please Login",
            });
        }

        const convertInto = new mongoose.Types.ObjectId(ShopId);
        const convertListing = new mongoose.Types.ObjectId(ListingId);

        // Check if shop exists
        const CheckMyShop = await ListingUser.findById(convertInto).select("-Password");
        if (!CheckMyShop) {
            return res.status(404).json({
                success: false,
                msg: "Shop not found",
            });
        }

        const { Title, Details, HtmlContent, tags } = req.body;

        // Find listing by ID
        const listing = await Listing.findById(convertListing);
        if (!listing) {
            return res.status(404).json({
                success: false,
                msg: "Listing not found",
            });
        }

        // Verify the listing belongs to the shop
        if (listing.ShopId.toString() !== ShopId) {
            return res.status(403).json({
                success: false,
                msg: "Unauthorized",
            });
        }




        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Update only the fields that are modified
        if (Title && Title !== listing.Title) listing.Title = Title;
        if (Details && Details !== listing.Details) listing.Details = Details;
        if (HtmlContent && HtmlContent !== listing.HtmlContent) listing.HtmlContent = HtmlContent;

        if (tags) {
            const splitTags = tags.split(",").map((tag) => tag.trim());
            listing.tags = splitTags;
        }

        // Update items if any changes were made
        if (updatedItems.length) listing.Items = updatedItems;

        // Mark the listing as unapproved
        listing.isApprovedByAdmin = false;

        // Save the updated listing
        await listing.save();

        // Send success response
        res.status(200).json({
            success: true,
            msg: "Listing updated successfully",
            listing,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating listing",
            error: error.message,
        });
    }
};


exports.getPostByCategory = async (req, res) => {
    try {
        const { Name } = req.params;
        // console.log(Name)
        // Fetch all listings by category
        const listings = await ListingUser.find({ ShopCategory: Name });

        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: 'No listings found for this category' });
        }


        const postsPromises = listings.map(async (listing) => {


            const posts = await Listing.find({ ShopId: listing._id, isApprovedByAdmin: true }).sort({ createdAt: -1 });


            const postsWithPlan = posts.map(post => ({
                ...post.toObject(),
                Plan: listing?.ListingPlan
            }));

            return postsWithPlan;
        });


        let postsArrays = await Promise.all(postsPromises);

        let posts = postsArrays.flat();

        const goldPosts = posts.filter(post => post.Plan === 'Gold');
        const silverPosts = posts.filter(post => post.Plan === 'Silver');
        const freePosts = posts.filter(post => post.Plan === 'Free');


        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };


        shuffle(goldPosts);
        shuffle(silverPosts);
        shuffle(freePosts);


        const combinedPosts = [...goldPosts, ...silverPosts, ...freePosts];

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};