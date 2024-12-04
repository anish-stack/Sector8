const Policy = require('../models/Policy.Model')
const Banner = require('../models/BannerModel')
const marquee = require('../models/marquee.model')
const Settings = require('../models/Settings.model')

const Cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv')
const result = dotenv.config();

Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});


exports.CreateBanner = async (req, res) => {
    try {

        const file = req.file || {}
        if (!file) {
            return res.status(400).json({ message: "Please upload a file" })
        }
        const uploadImage = (file) => {
            return new Promise((resolve, reject) => {
                const stream = Cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve({ public_id: result.public_id, imageUrl: result.secure_url });
                    } else {
                        reject(error || "Failed to upload image.");
                    }
                });
                stream.end(file.buffer); // Ensure the buffer exists in req.file
            });
        };

        const { public_id, imageUrl } = await uploadImage(file);


        const newBanner = new Banner({
            image: {
                url: imageUrl,
                public_id: public_id
            }
        });
        await newBanner.save();

        // Respond with success
        res.status(201).json({
            success: true,
            message: "Banner created successfully.",
            data: newBanner
        });
    } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message || error
        });
    }
}
exports.GetAllBanner = async (req, res) => {
    try {
        // Fetch active banners and sort by creation date in descending order
        const banners = await Banner.find().sort({ createdAt: -1 });

        // Respond with the banners
        res.status(200).json({
            success: true,
            message: banners.length ? "Banners retrieved successfully" : "No banners found",
            data: banners,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: "Failed to retrieve banners",
            error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error",
        });
    }
};
exports.GetAllBannerActive = async (req, res) => {
    try {
        // Fetch active banners and sort by creation date in descending order
        const banners = await Banner.find({ active: true }).sort({ createdAt: -1 });

        // Respond with the banners
        res.status(200).json({
            success: true,
            message: banners.length ? "Banners retrieved successfully" : "No banners found",
            data: banners,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: "Failed to retrieve banners",
            error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error",
        });
    }
};


exports.DeleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the banner
        const deletedBanner = await Banner.findByIdAndDelete(id);

        if (!deletedBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
            data: deletedBanner,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete banner",
            error: error.message,
        });
    }
};
exports.UpdateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updateFields = {};

        // Handle file upload if `req.file` exists
        if (req.file) {
            const file = req.file;
            console.log(file)
            // Upload the file to Cloudinary
            const uploadedImage = await new Promise((resolve, reject) => {
                Cloudinary.uploader.upload_stream(
                    { folder: "banners" }, // Optional: specify a folder in Cloudinary
                    (error, result) => {
                        if (result) {
                            resolve({ url: result.secure_url, public_id: result.public_id });
                        } else {
                            reject(error || "Image upload failed");
                        }
                    }
                ).end(file.buffer);
            });

            // Add the uploaded image details to the updateFields
            updateFields.image = {
                url: uploadedImage.url,
                public_id: uploadedImage.public_id,
            };
        }

        // Update other fields
        if (typeof updates.active !== "undefined") {
            updateFields.active = updates.active; // Toggle active status
        }
        if (updates.title) {
            updateFields.title = updates.title; // Update title, if provided
        }

        // Perform the update
        const updatedBanner = await Banner.findByIdAndUpdate(id, updateFields, {
            new: true, // Return the updated document
            runValidators: true, // Ensure the updates follow the schema
        });

        if (!updatedBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }
        console.log(updatedBanner)

        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: updatedBanner,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update banner",
            error: error.message,
        });
    }
};



exports.MakeSetting = async (req, res) => {
    try {
        const { logo, contactNumber, adminId, officeAddress, links, FooterEmail } = req.body;

        const newSetting = new Settings({
            logo,
            contactNumber,
            adminId,
            officeAddress,
            links,
            FooterEmail
        });

        const savedSetting = await newSetting.save();

        res.status(201).json({
            success: true,
            message: 'Setting created successfully',
            data: savedSetting,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create setting',
            error: error.message,
        });
    }
};

// GetSetting: Fetch settings document
exports.GetSetting = async (req, res) => {
    try {
        const setting = await Settings.findOne();

        if (!setting) {
            return res.status(404).json({
                success: false,
                message: 'No settings found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Setting retrieved successfully',
            data: setting,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve setting',
            error: error.message,
        });
    }
};

// UpdateSetting: Update only the fields that are sent in the request body
exports.UpdateSetting = async (req, res) => {
    try {
        const updates = req.body;

        // Update only the fields that are provided in the request body
        const updatedSetting = await Settings.findOneAndUpdate(
            {}, // Match the first document (assuming there's only one settings document)
            { $set: updates }, // Update only the provided fields
            { new: true, upsert: true } // Return the updated document and create if not exists
        );

        res.status(200).json({
            success: true,
            message: 'Setting updated successfully',
            data: updatedSetting,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update setting',
            error: error.message,
        });
    }
};


exports.createMarquee = async (req, res) => {
    try {
        const { title, active } = req.body;

        // Create a new marquee
        const newMarquee = new marquee({
            title,
            active
        });

        // Save the marquee to the database
        await newMarquee.save();

        res.status(201).json({
            success: true,
            message: 'Marquee created successfully',
            data: newMarquee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create marquee',
            error: error.message
        });
    }
};


exports.updateMarquee = async (req, res) => {
    try {
        const { id } = req.params; // Get marquee ID from the URL parameter
        const { title, active } = req.body; // Get new values for title and active

        // Find the marquee by its ID and update it
        const updatedMarquee = await marquee.findByIdAndUpdate(id, { title, active }, { new: true });

        if (!updatedMarquee) {
            return res.status(404).json({
                success: false,
                message: 'Marquee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Marquee updated successfully',
            data: updatedMarquee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update marquee',
            error: error.message
        });
    }
};

exports.deleteMarquee = async (req, res) => {
    try {
        const { id } = req.params; // Get marquee ID from the URL parameter

        // Find and delete the marquee by its ID
        const deletedMarquee = await marquee.findByIdAndDelete(id);

        if (!deletedMarquee) {
            return res.status(404).json({
                success: false,
                message: 'Marquee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Marquee deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete marquee',
            error: error.message
        });
    }
};

exports.getAllMarquee = async (req, res) => {
    try {
        // Fetch all marquees from the database
        const marquees = await marquee.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: marquees.length ? 'Marquees retrieved successfully' : 'No marquees found',
            data: marquees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve marquees',
            error: error.message
        });
    }
};