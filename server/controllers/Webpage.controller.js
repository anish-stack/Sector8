const Policy = require('../models/Policy.Model')
const Banner = require('../models/BannerModel')
const marquee = require('../models/marquee.model')
const Settings = require('../models/Settings.model')
const bannerModel = require('../models/OffersBanner')
const mongoose = require('mongoose');
const streamifier = require('streamifier')
const Cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config()
Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.envCLOUDINARY_API_KEY,
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
        const mongooseId = new mongoose.Types.ObjectId(id);
        const updateFields = {};
        console.log(mongooseId)
        // Handle file upload if `req.file` exists
        if (req.file) {
            const file = req.file;

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
            console.log("Active status updated to:", updates.active);
        }
        if (updates.title) {
            updateFields.title = updates.title; // Update title, if provided
        }

        // Perform the update
        const updatedBanner = await Banner.findByIdAndUpdate(mongooseId, updateFields, {
            new: true, // Return the updated document
            runValidators: true, // Ensure the updates follow the schema
        });

        if (!updatedBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: updatedBanner,
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Failed to update banner",
            error: error.message,
        });
    }
};



exports.MakeSetting = async (req, res) => {
    try {

        const { logo, footerLogo, BioFooter, isFestiveTopPopUpShow, isFestiveBottomPopUpShow, AboveTopGif, BottomGifLink, GstNo, contactNumber, adminId, officeAddress, links, FooterEmail } = req.body;


        const newSetting = new Settings({
            logo,
            contactNumber,
            adminId,
            officeAddress,
            links,
            FooterEmail,
            footerLogo,
            BioFooter,
            isFestiveTopPopUpShow,
            isFestiveBottomPopUpShow,
            AboveTopGif,
            BottomGifLink,
            GstNo,
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

exports.UpdateSetting = async (req, res) => {
    try {
        const updates = req.body;


        const updatedSetting = await Settings.findOneAndUpdate(
            {},
            { $set: updates },
            { new: true, upsert: true }
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


exports.createOfferBanner = async (req, res) => {
    try {
        const { active, RedirectPageUrl } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }




        const uploadFromBuffer = (buffer) => {
            return new Promise((resolve, reject) => {
                let stream = Cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };


        const uploadResult = await uploadFromBuffer(file.buffer);
        const imageUrl = uploadResult.url;

        const newBanner = new bannerModel({

            active,

            RedirectPageUrl,

            Banner: {
                url: imageUrl
            }
        });


        await newBanner.save();


        res.status(201).json({
            success: true,
            data: newBanner,
            message: 'Banner created successfully'
        });



    } catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


exports.getOfferAllBanner = async (req, res) => {
    try {
        const getAllBanner = await bannerModel.find();
        if (getAllBanner === 0) {
            return res.status(400).json({
                success: false,
                msg: "Banner Not Avilable Now"
            })
        }
        res.status(201).json({
            success: true,
            data: getAllBanner,
            msg: "All Banner Found"
        })

    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.deleteOfferBanner = async (req, res) => {
    try {
        const id = req.params.id;

        const checkBanner = await bannerModel.findByIdAndDelete({ _id: id })

        if (!checkBanner) {
            return res.status(403).json({
                success: false,
                msg: "Banner Not Found"
            })
        }
        const pastImageUrl = checkBanner.Banner.url;
        const publicId = pastImageUrl.split('/').pop().split('.')[0];


        await Cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error("Error in deleting old image:", error);
            } else {
                console.log("Old image deleted:", result);
            }
        });

        res.status(200).json({
            success: true,
            msg: "Banner Deleted Successfully !!"
        })
    } catch (error) {
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.updateOfferBanner = async (req, res) => {
    try {
        const BannerId = req.params.id;
        const updates = { ...req.body };
        const file = req.file;
        const banner = await bannerModel.findById(BannerId)
        if (!banner) {
            return res.status(403).json({
                success: false,
                message: "This Banner Details Is Not Available"
            })
        }

        if (file) {

            const uploadFromBuffer = (buffer) => {
                return new Promise((resolve, reject) => {
                    let stream = Cloudinary.uploader.upload_stream((error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(buffer).pipe(stream);
                });
            };


            const uploadResult = await uploadFromBuffer(file.buffer);

            const imageUrl = uploadResult.secure_url;
            if (!imageUrl) {
                return res.status(403).json({
                    success: false,
                    message: "Error in Uploading Image At Cloudinary"
                })
            }
            else {


                const pastImageUrl = banner.Banner.url;
                const publicId = pastImageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL

                // Destroy the old image in Cloudinary
                await Cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        console.error("Error in deleting old image:", error);
                    } else {
                        console.log("Old image deleted:", result);
                    }
                });

                // Add the new image URL to updates
                updates.Banner = { url: imageUrl };
            }
            // Add the image URL to updates
            updates.Banner = { url: imageUrl };
        }

        // Find the banner by ID and update it with new data
        const updatedBanner = await bannerModel.findByIdAndUpdate(BannerId, updates, { new: true });

        if (!updatedBanner) {
            return res.status(404).json({
                success: false,
                msg: "Banner not found."
            });
        }

        res.status(200).json({
            success: true,
            msg: "Banner updated successfully.",
            data: updatedBanner
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};