const Partner = require('../models/Partner.model');
const sendEmail = require('../utils/SendEmail');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const ListingUser = require('../models/User.model'); // Adjust the path as per your project structure
const sendToken = require('../utils/SendToken')
// Create New Partner
exports.createPartner = async (req, res) => {
    try {
        const { PartnerName, PartnerEmail, PartnerContactDetails, Password } = req.body;

        // Validate request data
        if (!PartnerName || !PartnerEmail || !PartnerContactDetails  || !Password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if partner already exists by email or contact details
        const existingPartner = await Partner.findOne({
            $or: [
                { PartnerEmail },
                { PartnerContactDetails }
            ]
        });

        if (existingPartner) {
            return res.status(400).json({ message: 'Partner with this email or contact details already exists' });
        }

        // Create new partner
        const newPartner = new Partner({
            PartnerName,
            PartnerEmail,
            PartnerContactDetails,
            Password
        });

        // Save the partner
        await newPartner.save();

        // Generate OTP for email verification
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newPartner.AccountVerifyOtp = otp;
        newPartner.ExpireTimeOtp = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        console.log(otp)
        // Save the OTP and expiration time
        await newPartner.save();

        // Send email with OTP
        const mailOptions = {
            email: PartnerEmail,
            subject: 'Verify your email',
            message: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Welcome to Our Platform, ${PartnerName}!</h2>
                    <p>Thank you for registering with us. Please use the following OTP to verify your email:</p>
                    <h3 style="color: #4CAF50;">${otp}</h3>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Best Regards,<br>Your Company Name</p>
                </div>
            `
        };
        await sendEmail(mailOptions);

        // Send response
        res.status(201).json({ message: 'Partner registered successfully. Verification email sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Verify OTP and Email
exports.verifyOtpAndEmail = async (req, res) => {
    try {
        const { PartnerEmail, otp } = req.body;

        const partner = await Partner.findOne({ PartnerEmail });
        if (!partner) {
            return res.status(400).json({ message: 'Partner not found' });
        }

        if (partner.AccountVerifyOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (partner.ExpireTimeOtp < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        partner.isEmailVerified = true;
        partner.AccountVerifyOtp = undefined;
        partner.ExpireTimeOtp = undefined;

        await partner.save();

        // Send email notification for successful verification
        const mailOptions = {
            email: PartnerEmail,
            subject: 'Account Verified Successfully',
            message: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Hello ${partner.PartnerName},</h2>
                    <p>Your email has been successfully verified. You can now access all features of your account.</p>
                    <p>Thank you for verifying your email.</p>
                    <p>Best Regards,<br>Your Company Name</p>
                </div>
            `
        };
        await sendEmail(mailOptions);
        await sendToken(partner,res,200)

        // res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resendAccountVerifyOtp = async (req, res) => {
    try {
        const { PartnerEmail } = req.body;

        // Find the partner by email
        const partner = await Partner.findOne({ PartnerEmail });
        if (!partner) {
            return res.status(400).json({ message: 'Partner not found' });
        }

        // Generate a new OTP for email verification
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        partner.AccountVerifyOtp = otp;
        partner.ExpireTimeOtp = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Save the new OTP and expiration time
        await partner.save();

        // Send email with the new OTP
        const mailOptions = {
            email: PartnerEmail,
            subject: 'Verify your email - Resend OTP',
            message: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Hello ${partner.PartnerName},</h2>
                    <p>We received a request to resend your email verification OTP. Please use the following OTP to verify your email:</p>
                    <h3 style="color: #4CAF50;">${otp}</h3>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Best Regards,<br>Your Company Name</p>
                </div>
            `
        };
        await sendEmail(mailOptions);

        res.status(200).json({ message: 'OTP resent successfully. Check your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Forget Password Request
exports.forgetPasswordRequest = async (req, res) => {
    try {
        const { PartnerEmail } = req.body;
        console.log(PartnerEmail)
        const partner = await Partner.findOne({ PartnerEmail });
        if (!partner) {
            return res.status(400).json({ message: 'Partner not found' });
        }

        // Generate OTP for password reset
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        partner.ResetPasswordOtp = otp;
        partner.ExpireTimeOtp = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

        // Send email with OTP
        const mailOptions = {
            email: PartnerEmail,
            subject: 'Password Forget Request - OTP',
            message: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Hello ${partner.PartnerName},</h2>
                    <p>We received a request to resend your email verification OTP. Please use the following OTP to verify your email:</p>
                    <h3 style="color: #4CAF50;">${otp}</h3>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Best Regards,<br>Your Company Name</p>
                </div>
            `
        }
        await sendEmail(mailOptions);

        await partner.save();

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resendForgetPasswordOtp = async (req, res) => {
    try {
        const { PartnerEmail } = req.body;
        console.log(PartnerEmail)
        // Find the partner by email
        const partner = await Partner.findOne({ PartnerEmail });
        if (!partner) {
            return res.status(400).json({ message: 'Partner not found' });
        }

        // Generate a new OTP for password reset
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        partner.ResetPasswordOtp = otp;
        partner.ExpireTimeOtp = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Save the new OTP and expiration time
        await partner.save();

        // Send email with the new OTP
        const mailOptions = {
            email: PartnerEmail,
            subject: 'Reset your password - Resend OTP',
            message: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Hello ${partner.PartnerName},</h2>
                    <p>We received a request to resend your password reset OTP. Please use the following OTP to reset your password:</p>
                    <h3 style="color: #4CAF50;">${otp}</h3>
                    <p>This OTP is valid for 5 minutes.</p>
                    <p>If you did not request this email, please ignore it.</p>
                    <p>Best Regards,<br>Your Company Name</p>
                </div>
            `
        };
        await sendEmail(mailOptions);

        res.status(200).json({ message: 'OTP resent successfully. Check your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Forget Password OTP Verified
exports.verifyForgetPasswordOtp = async (req, res) => {
    try {
        const { PartnerEmail, otp, newPassword } = req.body;

        const partner = await Partner.findOne({ PartnerEmail });
        if (!partner) {
            return res.status(400).json({ message: 'Partner not found' });
        }

        if (partner.ResetPasswordOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (partner.ExpireTimeOtp < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Hash the new password and save

        partner.Password = newPassword
        partner.ResetPasswordOtp = undefined;
        partner.ExpireTimeOtp = undefined;

        await partner.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { PartnerEmail, Password } = req.body;

        // Find the partner by email
        const partner = await Partner.findOne({ PartnerEmail });
        if (!partner) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password matches
        const isMatch = await partner.comparePassword(Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!partner.isEmailVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in' });
        }

        // Generate and send token using sendToken function
        await sendToken(partner, res, 201); // This function sets the response and sends the token

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
// Delete Partner Account
exports.deletePartnerAccount = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const partner = await Partner.findByIdAndDelete(id);
        if (!partner) {
            return res.status(400).json({ message: 'Partner not found' });
        }

        res.status(200).json({ message: 'Partner account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.GetAllShopListByPartner = async (req, res) => {
    try {
        const PartnerId = req.user.id; // Assuming PartnerId is stored in req.user.id (from authentication middleware)

        // Find all shops by PartnerId
        const AllShop = await ListingUser.find({ PartnerId });

        if (AllShop.length === 0) {
            return res.status(404).json({ message: 'No shops found for this partner' });
        }

        res.status(200).json({ shops: AllShop });
    } catch (error) {
        console.error('Error fetching shops:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.GetAllShopListByPartnerAdmin = async (req, res) => {
    try {
        const PartnerId = req.params.id; // Assuming PartnerId is stored in req.user.id (from authentication middleware)

        // Find all shops by PartnerId
        const AllShop = await ListingUser.find({ PartnerId });

        if (AllShop.length === 0) {
            return res.status(404).json({ message: 'No shops found for this partner' });
        }

        res.status(200).json({ shops: AllShop });
    } catch (error) {
        console.error('Error fetching shops:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllPartner = async (req,res)=>{
    try {
        const AllPartner = await Partner.find()
        if(AllPartner.length === 0){
            return res.status(403).json({
                success:false,
                msg:"No partner Found"
            })
        }
        res.status(201).json({
            success:true,
            data:AllPartner,
            msg:"Fetched Success"
        })
    } catch (error) {
        res.status(201).json({
            success:false,
            data:error,
            msg:"Fetched Failed"
        })
    }
}