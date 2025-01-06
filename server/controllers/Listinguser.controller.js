const ListingUser = require('../models/User.model'); // Adjust the path as per your project structure
const sendEmail = require('../utils/SendEmail');
const sendToken = require('../utils/SendToken');
const Listing = require('../models/listing.model');
// const dotenv = require('dotenv')
// dotenv.config()
require('dotenv').config()
const Cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios')
const Plans = require('../models/Pacakge')
const nodemailer = require('nodemailer');
const Payment = require('../models/PaymentDetails')
// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_APT_KEY,
//     key_secret: process.env.RAZORPAY_APT_SECRET,
// });
const { StatusCodes } = require('http-status-codes');
const Settings = require('../models/Settings.model')
const Partner = require('../models/Partner.model')
const { validationResult } = require('express-validator');
const authService = require('../Service/authService');
const paymentService = require('../Service/paymentService');
const Package = require('../models/Pacakge');
Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.envCLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
// Create a new ListingUser

exports.ListUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST)
                .json({ success: false, errors: errors.array() });
        }


        const {
            UserName, Email, ContactNumber, ShopName,
            ShopAddress, ShopCategory, ListingPlan,
            HowMuchOfferPost, Password, LandMarkCoordinates
        } = req.body;

        // console.log(req.body)
        // Auth check
        const token = authService.extractToken(req);
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED)
                .json({ success: false, message: 'Please Login to Access this' });
        }

        // Get PartnerId
        const { id: PartnerId } = await authService.verifyToken(token);

        // Check if the user already exists by email or contact number
        const existingUser = await ListingUser.findOne({
            $or: [{ Email }, { ContactNumber }]
        });

        // If user exists and they don't have a free listing, create a payment order
        if (existingUser) {
            if (existingUser.FreeListing && ListingPlan !== 'Free') {
                const order = await paymentService.createOrder(ListingPlan, UserName);
                return res.status(StatusCodes.OK)
                    .json({ success: true, order });
            } else {
                return res.status(StatusCodes.CONFLICT)
                    .json({ success: false, message: 'User already exists with this Email or Contact Number and has a Free Listing Memeber' });
            }
        }

        // Prepare shop address
        const formattedShopAddress = {
            City: ShopAddress?.City,
            PinCode: ShopAddress?.PinCode,
            ShopAddressStreet: ShopAddress?.ShopAddressStreet,
            ShopNo: ShopAddress?.ShopNo,
            NearByLandMark: ShopAddress?.NearByLandMark,
            Location: {
                type: 'Point',
                coordinates: [
                    ShopAddress?.ShopLongitude,
                    ShopAddress?.ShopLatitude
                ],
            }
        };

        const plans = await Plans.find()
        const plan = plans.find(plan => plan.packageName === ListingPlan)


        // Create user data
        const userData = {
            UserName, Email, ContactNumber, ShopName,
            ShopAddress: formattedShopAddress,
            ShopCategory, ListingPlan,
            ProfilePic: `https://ui-avatars.com/api/?name=${UserName}&background=random`,
            HowMuchOfferPost,
            PackagePlanIssued: plan.postsDone,
            Password,
            PartnerId,
            LandMarkCoordinates,
            FreeListing: ListingPlan === 'Free - Rs:0' ? 'Free Listing' : undefined
        };

        // Create new user
        const newUser = new ListingUser(userData);

        // Handle different listing plans
        if (ListingPlan === 'Free - Rs:0') {
            await newUser.save();
            await Partner.findByIdAndUpdate(PartnerId, { $inc: { PartnerDoneListing: 1 } });

            return res.status(StatusCodes.CREATED)
                .json({ success: true, message: 'User created successfully', user: newUser });
        }

        // If the plan is not Free, create a payment order
        const order = await paymentService.createOrder(ListingPlan, UserName);
        newUser.OrderId = order.id;
        await newUser.save();

        return res.status(StatusCodes.OK)
            .json({ success: true, order });

    } catch (error) {
        console.error('Error in ListUser:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
    }
};

exports.getSingleListingUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await ListingUser.findById(id).populate('PartnerId').populate('OrderId').
            populate('PackagePlanIssued').populate('HowMuchOfferPost').populate('ShopCategory');
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

exports.updateShopAddress = async (req, res) => {
    const { userId } = req.params; // Assuming you pass the user ID as a URL parameter
    const { ShopAddress, LandMarkCoordinates } = req.body; // Expecting ShopAddress in the request body

    if (!ShopAddress) {
        return res.status(400).json({
            success: false,
            message: "ShopAddress is required.",
        });
    }
    if (!LandMarkCoordinates) {
        return res.status(400).json({
            success: false,
            message: "LandMarkCoordinates is required.",
        });
    }

    // Validate required fields in ShopAddress
    const { City, PinCode, ShopAddressStreet, ShopNo, NearByLandMark, ShopLongitude, ShopLatitude } = ShopAddress;

    if (!PinCode || !ShopAddressStreet || !ShopNo || !NearByLandMark || !ShopLongitude || !ShopLatitude) {
        return res.status(400).json({
            success: false,
            message: "All required fields in ShopAddress must be provided.",
        });
    }

    // Format ShopAddress
    const formattedShopAddress = {
        City: City || null,
        PinCode,
        ShopAddressStreet,
        ShopNo,
        NearByLandMark,
        Location: {
            type: 'Point',
            coordinates: [ShopLongitude, ShopLatitude],
        },
    };

    try {
        // Find the user by ID
        const user = await ListingUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Update ShopAddress
        user.ShopAddress = formattedShopAddress;
        user.LandMarkCoordinates = LandMarkCoordinates;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "ShopAddress updated successfully.",
            data: user.ShopAddress,
        });
    } catch (error) {
        console.error("Error updating ShopAddress:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating ShopAddress.",
        });
    }
};

exports.addBussinessHours = async (req, res) => {
    try {

        const user = req.user.id

        const { BussinessHours } = req.body;

        if (
            !BussinessHours ||
            typeof BussinessHours !== "object" ||
            !BussinessHours.openTime ||
            !BussinessHours.closeTime ||
            !BussinessHours.offDay
        ) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'BussinessHours must be an object containing openTime, closeTime, and offDay.',
            });
        }

        // Update the business hours for the shop
        const shop = await ListingUser.findByIdAndUpdate(
            user,
            { $set: { BussinessHours } },
            { new: true }
        );

        // If shop not found, return a 404 response
        if (!shop) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Shop not found',
            });
        }

        // Respond with success and updated shop data
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Business hours updated successfully',
            data: shop,
        });
    } catch (error) {
        // Handle errors and respond with 500
        console.error('Error updating business hours:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'An error occurred while updating business hours.',
            error: error.message,
        });
    }
};


exports.UploadProfileImage = async (req, res) => {
    try {
        // Get the user ID from the request
        const user = req.user.id;

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const checkShop = await ListingUser.findById(user);
        if (!checkShop) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false
            });
        }

        // Check if a file was uploaded
        const file = req.file;
        if (!file || Object.keys(file).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Upload image to Cloudinary and wait for result
        const uploadResult = await new Promise((resolve, reject) => {
            Cloudinary.uploader.upload_stream(
                {
                    folder: `profile_images`,
                    public_id: `profile_${user}`,
                    overwrite: true,
                    transformation: { width: 300, height: 300, crop: 'fill' }
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject('Error uploading image to Cloudinary');
                    }
                    resolve(result);
                }
            ).end(file.buffer);
        });

        // Update the user's profile picture URL
        checkShop.ProfilePic = uploadResult.secure_url;
        await checkShop.save();

        // Return the result with Cloudinary image details
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Profile image uploaded successfully',
            data: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            }
        });

    } catch (error) {
        console.error('Error uploading profile image:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error uploading profile image'
        });
    }
};


exports.UpdateProfileDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if the user is authorized
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Find the user's shop details
        const checkShop = await ListingUser.findById(userId);
        if (!checkShop) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Shop not found'
            });
        }

        // Destructure the fields from the request body
        const { ShopName, UserName, Email, ContactNumber } = req.body;
        console.log(req.body)
        // Prepare an object for the updated fields
        const updatedFields = {};

        // Check and add fields to be updated
        if (ShopName && ShopName !== checkShop.ShopName) {
            updatedFields.ShopName = ShopName;
        }
        if (UserName && UserName !== checkShop.UserName) {
            updatedFields.UserName = UserName;
        }
        if (Email && Email !== checkShop.Email) {
            updatedFields.Email = Email;
        }
        if (ContactNumber && ContactNumber !== checkShop.ContactNumber) {
            updatedFields.ContactNumber = ContactNumber;
        }


        // If no fields were updated, return a response
        if (Object.keys(updatedFields).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'No fields have been updated.'
            });
        }

        // Update the shop details with the new values
        const updatedShop = await ListingUser.findByIdAndUpdate(userId, updatedFields, { new: true });

        // Respond with the updated shop details
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedShop
        });

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Something went wrong while updating the profile.'
        });
    }
};


exports.getAllShops = async (req, res) => {
    try {
        const shops = await ListingUser.find();
        if (shops.length === 0) {
            return res.status(404).json({ message: 'No shops found' });
        }
        res.status(200).json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.paymentVerification = async (req, res) => {
    try {
        console.log(req.body)
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        let findUser = await ListingUser.findOne({ OrderId: razorpay_order_id });

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_APT_SECRET || "seWgj8epMRq7Oeb7bvC3IZCe")
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database logic comes here

            await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            if (findUser) {
                findUser.PaymentDone = true;
                await findUser.save();
            } else {

                console.error('User not found for the given order ID');

            }
            res.redirect(
                `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
            );
        } else {
            findUser.PaymentDone = false;
            await findUser.save();
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        console.error('Error in payment verification:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong in payment verification',
        });
    }
};
// Login a ListingUser
exports.LoginListUser = async (req, res) => {
    try {
        console.log("i am")
        const { any, Password } = req.body;
        console.log(req.body)

        if (!any || !Password) {
            return res.status(400).json({ message: 'Both "any" and "Password" are required' });
        }

        // Find user by Email, UserName, or ContactNumber
        const user = await ListingUser.findOne({
            $or: [
                { Email: any },
                { UserName: any },
                { ContactNumber: any }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isPasswordMatch = await user.comparePassword(Password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate and send token
        await sendToken(user, res, 200);

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.CreateForgetPasswordRequest = async (req, res) => {
    try {
        const { Email, newPassword } = req.body;

        // Check if required fields are missing
        if (!Email || !newPassword) {
            return res.status(403).json({
                success: false,
                msg: "Please Fill All Fields"
            });
        }

        // Find user by email (assuming Email is unique)
        const user = await ListingUser.findOne({ Email });

        // If user not found, handle accordingly
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        const generateOtp = () => {
            const otpLength = 6;
            const otp = Math.random().toString().substr(2, otpLength); // Generate random OTP
            return otp;
        };

        const otp = generateOtp();


        const otpExpiryTime = new Date();
        otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);


        user.PasswordChangeOtp = otp;
        user.newPassword = newPassword
        user.OtpExipredTme = otpExpiryTime;
        await user.save();


        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: "noreply@naideal.com",
                pass: "Naideal@2024"
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: '"Naideal Support" <noreply@naideal.com>',
            to: Email,
            subject: 'Password Change Request',
            html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

        <tr>
            <td style="text-align: center;">
                <svg viewBox="0 0 600 40" style="width: 100%; height: 40px;">
                    <path d="M0,0 C150,40 450,40 600,0" fill="#3B82F6" opacity="0.1"></path>
                </svg>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px 20px; text-align: center; background-color: #ffffff;">
                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); padding: 15px; border-radius: 10px; display: inline-block;">
                    <img src="https://res.cloudinary.com/dglihfwse/image/upload/c_thumb,w_200,g_face/v1733212496/naideal-logo_fajvxe.png" alt="Naideal Logo" style="max-width: 200px; height: auto;">
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 30px;">
                <div style="position: relative;">
                    <!-- Decorative Corner SVG -->
                    <svg width="40" height="40" style="position: absolute; top: -10px; left: -20px; opacity: 0.1;">
                        <circle cx="20" cy="20" r="20" fill="#22C55E"/>
                    </svg>
                    <h2 style="color: #3B82F6; margin-bottom: 20px; position: relative;">Password Change Request</h2>
                </div>
                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 15px;">Hello ${user.ShopName},</p>
                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 15px;">You have requested a password change. Please use the following OTP to proceed:</p>
                
                <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.1);">
                    <h3 style="color: #3B82F6; font-size: 32px; margin: 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);">${otp}</h3>
                </div>
                
                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This OTP is valid for 10 minutes. Please use it within this time frame.</p>
                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">If you did not request this change, please ignore this email.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://naideal.com/VerifyOtp?Email=${Email}" style="background: linear-gradient(135deg, #22C55E, #1ea550); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(34, 197, 94, 0.2); transition: transform 0.2s ease;">Reset Password</a>
                </div>
                
                <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px; position: relative;">
                   
                    <svg width="30" height="100" style="position: absolute; right: -15px; top: 50%; transform: translateY(-50%); opacity: 0.1;">
                        <path d="M0,0 C30,25 30,75 0,100" stroke="#3B82F6" fill="none" stroke-width="2"/>
                    </svg>
                    <p style="color: #333333; font-size: 16px; margin: 0;">Thank you,</p>
                    <p style="color: #3B82F6; font-size: 18px; font-weight: bold; margin: 5px 0;">Nai Deal</p>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background: linear-gradient(135deg, #3B82F6, #2563eb); padding: 30px 20px; text-align: center; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                <div style="position: relative;">
                 
                    <svg width="100%" height="30" style="position: absolute; top: -29px; left: 0; opacity: 0.1;">
                        <path d="M0,30 C150,0 450,0 600,30" fill="#3B82F6"></path>
                    </svg>
                    <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);">© 2024 Naideal. All Rights Reserved.</p>
                    <p style="color: #ffffff; font-size: 14px; margin: 0;">
                        Designed with <span style="color: #ff0000; text-shadow: 0 0 3px rgba(255, 0, 0, 0.3);">❤️</span> by
                        <span style="color: #ffffff; font-weight: bold; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);">Digital4Now</span>
                    </p>
                </div>
            </td>
        </tr>
    </table>
</body>
`

        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({
                    success: false,
                    msg: 'Error sending OTP email'
                });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({
                success: true,
                msg: 'OTP sent successfully'
            });
        });

    } catch (error) {
        console.error('Error in forget password request:', error);
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { PasswordChangeOtp, Email } = req.body;

        // Check if the email exists in ListingUser
        const user = await ListingUser.findOne({ Email });

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Check if the provided OTP matches and is not expired
        if (user.PasswordChangeOtp !== PasswordChangeOtp) {
            return res.status(400).json({ success: false, msg: 'Invalid OTP' });
        }

        // Check if OTP has expired
        const currentTimestamp = new Date().getTime();
        if (user.OtpExipredTme && currentTimestamp > user.OtpExipredTme.getTime()) {
            return res.status(400).json({ success: false, msg: 'OTP has expired' });
        }

        // Update user's password
        const newPassword = user.newPassword;
        user.Password = newPassword;
        user.newPassword = null
        user.PasswordChangeOtp = null;
        user.OtpExipredTme = null;

        // Save user
        await user.save();

        // Respond with success message
        res.status(200).json({ success: true, msg: 'Password updated successfully' });

    } catch (error) {
        console.error('Error verifying OTP and updating password:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


// Update details of a ListingUser
exports.updateDetailsOfListUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find user by ID and update
        const updatedUser = await ListingUser.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User details updated', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Request to change password with OTP for a ListingUser
exports.PasswordChangeRequestOzfListUser = async (req, res) => {
    try {
        const { UserName } = req.body;

        // Find user by username
        const user = await ListingUser.findOne({ UserName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP for password change request
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.PasswordChangeOtp = otp;
        await user.save();

        // Send email with OTP
        const mailOptions = {
            email: user.UserName,
            subject: 'Password Change OTP',
            message: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Hello ${user.UserName},</h2>
                    <p>Your OTP for password change request is:</p>
                    <h3 style="color: #4CAF50;">${otp}</h3>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this change, please ignore this email.</p>
                    <p>Best Regards,<br>Your Company Name</p>
                </div>
            `
        };
        await sendEmail(mailOptions);

        res.status(200).json({ message: 'Password change OTP sent successfully. Check your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Render OTP of ListingUser
exports.RenderedOtpOfListUser = async (req, res) => {
    try {
        const { UserName } = req.body;

        // Find user by username
        const user = await ListingUser.findOne({ UserName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Rendered OTP successfully', otp: user.PasswordChangeOtp });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all ListingUsers
exports.getAllListUsers = async (req, res) => {
    try {
        const users = await ListingUser.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a ListingUser
exports.DeleteListUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by ID and delete
        const deletedUser = await ListingUser.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all posts associated with the user
        await Listing.deleteMany({ ShopId: id });

        res.status(200).json({ message: 'User and their posts deleted successfully', user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get My Details 
exports.MyShopDetails = async (req, res) => {
    try {
        // Assuming req.user.id is set correctly
        const MyShop = req.user.id;
        // console.log('User ID:', MyShop);

        // Finding the shop details based on the user ID
        const CheckMyShop = await ListingUser.findById(MyShop).populate('ShopCategory', 'CategoriesName').select('-Password');
        // console.log('Shop Details:', CheckMyShop);

        if (!CheckMyShop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Returning the shop details
        res.status(200).json({ message: 'User Shop Details retrieved successfully', user: CheckMyShop });

    } catch (error) {
        // Handling errors and sending a response
        res.status(500).json({ message: error.message });
    }
};

//Create-Post For Shop Listing
exports.CreatePost = async (req, res) => {
    try {
        const ShopId = req.user.id;

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

        const { ListingPlan, HowMuchOfferPost } = CheckMyShop;
        console.log(ListingPlan, HowMuchOfferPost)
        const Plans = await Package.findOne({ packageName: ListingPlan });
        if (!Plans) {
            return res.status(404).json({
                success: false,
                msg: `No package found for plan: ${ListingPlan}`
            });
        }

        if (HowMuchOfferPost >= Plans.postsDone) {
            return res.status(403).json({
                success: false,
                msg: `You have reached the post limit for your ${ListingPlan} plan. Please upgrade your plan.`
            });
        }

        const { Title, Details, HtmlContent, tags } = req.body;
        console.log(req.body)
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

        // Process general images
        const uploadedGeneralImages = await Promise.all(req.files
            .filter(file => file.fieldname === 'images')
            .map(file => uploadToCloudinary(file)));
        console.log(tags); // Logs the tags string, e.g., "#FoodInrohini, #ometotindia"

        const splitTags = tags.split(',').map(tag => tag.trim());
        console.log(splitTags);
        const newPost = await Listing.create({
            Title,
            Details,
            Items,
            tags: splitTags,
            HtmlContent,
            Pictures: uploadedGeneralImages,
            ShopId,
        });

        CheckMyShop.HowMuchOfferPost += 1;
        await CheckMyShop.save();
        // console.log(newPost)
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


exports.getAllPost = async (req, res) => {
    try {
        // Fetch all listings from the database
        const listings = await Listing.find();

        // If no listings found, return an error response
        if (listings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No listings found.',
            });
        }

        // Fetch all ShopDetails to categorize by plan type
        const shopDetails = await ListingUser.find();

        // If no shopDetails found, handle accordingly
        if (shopDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No shop details found.',
            });
        }

        // Categorize listings by plan type
        let goldListings = [];
        let silverListings = [];
        let freeListings = [];

        listings.forEach(listing => {
            const foundShopDetails = shopDetails.find(sd => sd._id.toString() === listing.ShopId.toString());
            if (!foundShopDetails) return; // Skip if shop details not found

            if (foundShopDetails.ListingPlan === 'Gold') {
                goldListings.push({
                    listing,
                    shopDetails: foundShopDetails
                });
            } else if (foundShopDetails.ListingPlan === 'Silver') {
                silverListings.push({
                    listing,
                    shopDetails: foundShopDetails
                });
            } else if (foundShopDetails.ListingPlan === 'Free') {
                freeListings.push({
                    listing,
                    shopDetails: foundShopDetails
                });
            }
        });

        // Shuffle the arrays to introduce randomness
        shuffleArray(goldListings);
        shuffleArray(silverListings);
        shuffleArray(freeListings);

        // Initialize counters for each type of listing
        let shuffledListings = []
        let goldCount = 0;
        let silverCount = 0;
        let freeCount = 0;

        for (let i = 0; i < listings.length; i++) {
            // Check if there are gold listings left to show and less than 2 gold posts have been added
            if (goldCount < goldListings.length && goldCount < 2) {
                // Push the next gold listing into shuffledListings
                shuffledListings.push(goldListings[goldCount]);
                goldCount++;
            } else if (silverCount < silverListings.length && silverCount < 2) {
                // Push the next silver listing into shuffledListings
                shuffledListings.push(silverListings[silverCount]);
                silverCount++;
            } else {
                // Push the next free listing into shuffledListings
                shuffledListings.push(freeListings[freeCount]);
                freeCount++;
            }
        }

        // Handle remaining gold and silver listings if any
        while (goldCount < goldListings.length) {
            shuffledListings.push(goldListings[goldCount]);
            goldCount++;
        }

        while (silverCount < silverListings.length) {
            shuffledListings.push(silverListings[silverCount]);
            silverCount++;
        }

        // Handle remaining free listings if any
        while (freeCount < freeListings.length) {
            shuffledListings.push(freeListings[freeCount]);
            freeCount++;
        }

        // console.log(shuffledListings)
        // Return successful response with shuffled listings
        return res.status(200).json({
            success: true,
            count: shuffledListings.length,
            data: shuffledListings,
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        // Return error response if there's a server error
        return res.status(500).json({
            success: false,
            error: 'Server error. Could not fetch listings.',
        });
    }
};
exports.getAllPostApprovedPost = async (req, res) => {
    try {
        let listings = [];
        const query = req.query;
        const { lat, lng } = query;

        // If no lat or lng is provided, fetch all approved listings without geospatial filtering
        if (!lat || !lng) {
            listings = await Listing.find({ isApprovedByAdmin: true }).populate('ShopId');
            return res.status(200).json({
                success: true,
                count: listings.length,
                data: listings.reverse(), // Optional: reverse the order if needed
            });
        }

        // Convert lat and lng to float and ensure valid coordinates
        const coordinates = [parseFloat(lng), parseFloat(lat)];

        // Validate coordinates
        if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
            return res.status(400).json({
                success: false,
                error: 'Invalid latitude or longitude provided.',
            });
        }

        // Fetch listings within 2km of the provided coordinates, first checking ShopAddress.Location
        listings = await Listing.aggregate([
            // Step 1: Populate ShopId first
            {
                $lookup: {
                    from: 'shops',  // Replace 'shops' with the correct collection name for the shops
                    localField: 'ShopId',  // The field in your Listing collection
                    foreignField: '_id',  // The field in the Shop collection that matches ShopId
                    as: 'ShopDetails',  // The name of the new array field to hold populated data
                },
            },

            // Step 2: Unwind the populated ShopDetails array
            {
                $unwind: {
                    path: '$ShopDetails',
                    preserveNullAndEmptyArrays: true,  // Handle cases where there's no matching Shop
                },
            },

            // Step 3: GeoNear query using populated ShopAddress.Location
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: coordinates },
                    distanceField: 'distance',
                    maxDistance: 2000,  // 2 km in meters
                    spherical: true,
                    query: { 'ShopDetails.ShopAddress.Location': { $exists: true } },  // Use the populated field
                },
            },

            // Step 4: Apply any additional filtering like isApprovedByAdmin
            {
                $match: {
                    isApprovedByAdmin: true,  // Filter for approved listings
                },
            },
        ]);

        console.log(listings);


        // If no listings found based on ShopAddress.Location, check the LandMarkCoordinates field
        if (listings.length === 0) {
            listings = await Listing.aggregate([
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: coordinates },
                        distanceField: 'distance',
                        maxDistance: 2000,  // 2 km in meters
                        spherical: true,
                        query: { 'ShopId.LandMarkCoordinates': { $exists: true } },
                    },
                },
                { $match: { isApprovedByAdmin: true } },
            ]);
        }

        // If still no listings are found, return all approved listings
        if (listings.length === 0) {
            listings = await Listing.find({ isApprovedByAdmin: true }).populate('ShopId');
        }

        console.log(listings.length); // Log the listings

        // Return the result to the client
        return res.status(200).json({
            success: true,
            count: listings.length,
            data: listings.reverse(), // Optional: reverse the order if needed
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error. Could not fetch listings.',
        });
    }
};


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}




exports.deletePostById = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }
        console.log(listing)
        // Delete associated images from Cloudinary
        const deleteImage = async (public_id) => {
            try {
                return await Cloudinary.uploader.destroy(public_id);
            } catch (error) {
                console.error(`Error deleting image with public_id ${public_id}:`, error);
                // You can choose to throw an error or continue based on your needs
                throw error;
            }
        };
        await Promise.all(listing.Pictures.map(pic => deleteImage(pic.public_id)));
        const ShopInfo = await ListingUser.findById(listing.ShopId);

        if (!ShopInfo) {
            return res.status(403).json({
                success: false,
                msg: "Shop Not Available"
            });
        } else {
            ShopInfo.HowMuchOfferPost -= 1;
            await ShopInfo.save(); // Save the updated ShopInfo
            await listing.deleteOne(); // Delete the listing
        }

        res.status(200).json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.deleteAllPost = async (req, res) => {
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

exports.getPostById = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        const shopDetails = await ListingUser.findById(listing.ShopId).populate('ShopCategory').select('-password');

        if (!shopDetails) {
            return res.status(404).json({ success: false, message: 'Shop details not found' });
        }

        // Combine listing data with shopDetails
        const listingWithShopDetails = {
            ...listing._doc,
            shopDetails,
        };

        res.status(200).json({ success: true, data: listingWithShopDetails });
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getMyPostOnly = async (req, res) => {
    try {
        const ShopId = req.user.id || req.query.id;
        const listings = await Listing.find({ ShopId });

        if (listings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No listings found for this shop.',
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

exports.getMyAllPost = async (req, res) => {
    try {
        // Extract ShopId from query parameters
        const ShopId = req.query.id;

        // Query listings based on ShopId, or fetch all if no ShopId is provided
        const query = ShopId ? { ShopId } : {};
        const listings = await Listing.find(query);

        if (listings.length === 0) {
            return res.status(404).json({
                success: false,
                message: ShopId
                    ? 'No listings found for this shop.'
                    : 'No listings found.',
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


exports.SearchByPinCodeCityAndWhatYouWant = async (req, res) => {
    try {
        const { City, WhatYouWant, searchType, PinCode, ShopCategory } = req.body.formData;

        // console.log("Query:", req.body.formData);

        if (searchType === 'advanced') {
            // First, find listings with matching City and ShopCategory
            const AdvancedListingShopData = await ListingUser.find({ 'ShopAddress.City': City, ShopCategory });
            console.log("AdvancedListingShopData", AdvancedListingShopData);

            // Extracting ids from AdvancedListingShopData
            const AdvancedlistingShopIds = AdvancedListingShopData.map(listing => listing._id);

            // Construct an array of regex patterns for each word in the query (case insensitive)
            const titleRegex = new RegExp(`.*${WhatYouWant.split('').join('.*')}.*`, 'i');

            // Find listings with matching ShopId and titles matching the regex pattern
            const AdvancedfetchPost = await Listing.find({
                ShopId: { $in: AdvancedlistingShopIds },
                Title: { $regex: titleRegex }
            });
            console.log(AdvancedfetchPost)
            // Combine ListingShopData with fetchPost entries
            const AdvancedshuffledListings = AdvancedfetchPost.map(post => {
                const shopDetails = AdvancedListingShopData.find(shop => shop._id.toString() === post.ShopId.toString());
                return { ...post.toObject(), ShopDetails: shopDetails };
            });

            // Shuffle the combined listings based on specified criteria (assuming shuffleListings is defined and correctly implemented)
            shuffleListings(AdvancedshuffledListings);

            // Respond with the shuffled listings including both ListingShopData and fetchPost
            res.status(200).json({ listings: AdvancedshuffledListings });
        } else {
            // Regular search by City and WhatYouWant
            const ListingShopData = await ListingUser.find({ 'ShopAddress.City': City });

            // Extracting ids from ListingShopData
            const listingShopIds = ListingShopData.map(listing => listing._id);

            // Construct an array of regex patterns for each word in the query (case insensitive)
            const wordRegexes = WhatYouWant.split(' ').map(word => new RegExp(`\\b${word}\\b`, 'i'));

            // Find listings with matching ShopId and titles matching the regex pattern
            const fetchPost = await Listing.find({
                ShopId: { $in: listingShopIds },
                $and: wordRegexes.map(regex => ({ Title: { $regex: regex } }))
            });

            // Combine ListingShopData with fetchPost entries
            const shuffledListings = fetchPost.map(post => {
                const shopDetails = ListingShopData.find(shop => shop._id.toString() === post.ShopId.toString());
                return { ...post.toObject(), ShopDetails: shopDetails };
            });

            // Shuffle the combined listings based on specified criteria (assuming shuffleListings is defined and correctly implemented)
            shuffleListings(shuffledListings);

            // Respond with the shuffled listings including both ListingShopData and fetchPost
            res.status(200).json({ listings: shuffledListings });
        }

    } catch (error) {
        console.error('Error searching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to shuffle listings based on specified criteria
function shuffleListings(listings) {
    let shuffledListings = [];
    let goldListings = [];
    let silverListings = [];
    let freeListings = [];

    // Categorize listings into gold, silver, and free based on your criteria
    listings.forEach(listing => {
        if (listing.ListingPlan === 'Gold') {
            goldListings.push(listing);
        } else if (listing.ListingPlan === 'Silver') {
            silverListings.push(listing);
        } else {
            freeListings.push(listing);
        }
    });

    // Shuffle gold listings (if any)
    shuffleArray(goldListings);
    // Shuffle silver listings (if any)
    shuffleArray(silverListings);
    // Shuffle free listings (if any)
    shuffleArray(freeListings);

    // Push shuffled listings into shuffledListings array
    shuffledListings = [...goldListings, ...silverListings, ...freeListings];

    return shuffledListings;
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to shuffle listings based on specified criteria
function shuffleListings(listings) {
    let shuffledListings = [];
    let goldListings = [];
    let silverListings = [];
    let freeListings = [];

    // Categorize listings into gold, silver, and free based on your criteria
    listings.forEach(listing => {
        if (listing.ListingPlan === 'Gold') {
            goldListings.push(listing);
        } else if (listing.ListingPlan === 'Silver') {
            silverListings.push(listing);
        } else {
            freeListings.push(listing);
        }
    });

    // Shuffle gold listings (if any)
    shuffleArray(goldListings);
    // Shuffle silver listings (if any)
    shuffleArray(silverListings);
    // Shuffle free listings (if any)
    shuffleArray(freeListings);

    // Push shuffled listings into shuffledListings array
    shuffledListings = [...goldListings, ...silverListings, ...freeListings];

    return shuffledListings;
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

exports.showPaymentDetails = async (req, res) => {
    try {
        const OrderId = req.params.id; // Assuming this is the razorpay_order_id
        const { RAZORPAY_API_KEY, RAZORPAY_API_SECRET } = process.env;

        const response = await axios({
            method: 'get',
            url: `https://api.razorpay.com/v1/orders/${OrderId}`, // Endpoint to fetch order details
            auth: {
                username: "rzp_test_gwvXwuaK4gKsY3",
                password: "nOcR6CCRiRYyDc87EXPzansH"
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const orderDetails = response.data; // Contains the order details including transaction information

        return res.status(200).json({
            success: true,
            orderDetails
        });
    } catch (error) {
        console.error('Error fetching payment details from Razorpay:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details from Razorpay'
        });
    }
};


exports.allPayments = async (req, res) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second delay between retries

    try {
        // Fetch all payments from MongoDB
        const paymentsDb = await Payment.find();

        // Function to fetch order details with retry logic
        const fetchOrderDetailsWithRetry = async (orderId, retries = 0) => {
            try {
                //                 RAZORPAY_APT_SECRET=seWgj8epMRq7Oeb7bvC3IZCe
                // RAZORPAY_KEY_ID=rzp_test_gQGRDFaoEskOdr
                const response = await axios({
                    method: 'get',
                    url: `https://api.razorpay.com/v1/orders/${orderId}`,
                    auth: {
                        username: "rzp_test_gQGRDFaoEskOdr",
                        password: "seWgj8epMRq7Oeb7bvC3IZCe"
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                return response.data;
            } catch (error) {
                if (error.response && error.response.status === 429 && retries < MAX_RETRIES) {
                    // Retry after delay
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * RETRY_DELAY));
                    return fetchOrderDetailsWithRetry(orderId, retries + 1);
                } else {
                    console.log(error)
                    throw error; // Throw error if retries exceed or different error encountered
                }
            }
        };

        // Array to store promises for fetching Razorpay order details
        const promises = paymentsDb.map(async (payment) => {
            try {
                // Fetch order details with retry logic
                const orderDetails = await fetchOrderDetailsWithRetry(payment.razorpay_order_id);
                return { ...payment.toObject(), orderDetails }; // Combine payment and orderDetails
            } catch (error) {
                console.error(`Error fetching order details for order ID ${payment.razorpay_order_id}:`, error);
                // Handle individual order fetch errors here if needed
                return { ...payment.toObject(), orderDetailsError: error.message };
            }
        });

        // Execute all promises concurrently
        const updatedPayments = await Promise.all(promises);

        // Respond with updated payments including order details
        return res.status(200).json({ success: true, payments: updatedPayments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};