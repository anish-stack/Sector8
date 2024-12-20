const Festive_Model = require("../models/Festive_Model");
const Cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv')
const streamifier = require('streamifier');

dotenv.config();

Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});



exports.createFBanner = async (req, res) => {
    try {
        const { ButtonText, active, RedirectPageUrl, Para, onWhicPage, dealy } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }


            // Function to upload image using buffer
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

            // Upload the image and get the URL
            const uploadResult = await uploadFromBuffer(file.buffer);
            const imageUrl = uploadResult.url;

            // Check if banner with the same ButtonText already exists


            // Create new banner object
            const newBanner = new Festive_Model({
                ButtonText,
                active,
                Para,
                RedirectPageUrl,
                onWhicPage, dealy,
                Banner: {
                    url: imageUrl
                }
            });

            // Save new banner to database
            await newBanner.save();

            // Respond with success message and new banner data
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

exports.getFAllBanner = async (req, res) => {
    try {
        const getAllBanner = await Festive_Model.find();
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

exports.getBanneronWhicPage = async (req, res) => {
    try {
        const onWhicPage = req.query.onWhicPage;
        const getAllBanner = await Festive_Model.find({ onWhicPage });
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

exports.deleteFBanner = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id)
        const checkBanner = await Festive_Model.findByIdAndDelete({ _id: id })
        // console.log(checkBanner)
        if (!checkBanner) {
            return res.status(403).json({
                success: false,
                msg: "Banner Not Found"
            })
        }
        const pastImageUrl = checkBanner.Banner.url;
        const publicId = pastImageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL

        // Destroy the old image in Cloudinary
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

exports.updateFBanner = async (req, res) => {
    try {
        const BannerId = req.params.id;
        const updates = { ...req.body }; // Spread to make a shallow copy of req.body
        const file = req.file;
        const banner = await Festive_Model.findById(BannerId)
        if (!banner) {
            return res.status(403).json({
                success: false,
                message: "This Banner Details Is Not Available"
            })
        }
        console.log(updates)

        if (file) {
            // Function to upload image using buffer
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

            // Upload the image and get the URL
            const uploadResult = await uploadFromBuffer(file.buffer);

            const imageUrl = uploadResult.secure_url;
            if (!imageUrl) {
                return res.status(403).json({
                    success: false,
                    message: "Error in Uploading Image At Cloudinary"
                })
            }
            else {
                //destroy the past image 

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
        const updatedBanner = await Festive_Model.findByIdAndUpdate(BannerId, updates, { new: true });

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
