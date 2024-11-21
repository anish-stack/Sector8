const Post  = require('../models/listing.model')
const ListingUser = require('../models/User.model'); // Adjust the path as per your project structure
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
const Partner = require('../models/Partner.model')
const Package = require('../models/Pacakge')
const City = require('../models/CityModel')
const Categorey = require('../models/CategoreiesModel')

exports.getUnApprovedPosts = async (req, res) => {
    try {
        const unApprovedPosts = await Post.find({ isApprovedByAdmin: false });

        if (!unApprovedPosts || unApprovedPosts.length === 0) {
            return res.status(404).json({ message: 'No unapproved posts found' });
        }

        res.status(200).json({ unApprovedPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.MakeAPostApproved = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.isApprovedByAdmin = true;

        await post.save();

        res.status(200).json({ message: 'Post approved successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getDashboardData = async (req, res) => {
    try {
        const paymentsResponse = await axios.get(`${process.env.BACKEND_URL}/api/v1/admin-all-payments`);
        const payments = paymentsResponse.data.payments;

        // Calculate total amount of all payments
        const totalPaymentAmount = payments.reduce((sum, payment) => {
            return sum + (payment.orderDetails.amount || 0); // Handle case where amount might be missing
        }, 0);
        const totalPaymentAmountRupees = totalPaymentAmount / 100;
        const partners = await Partner.find();
        const packages = await Package.find();
        const posts = await Post.find();
        const totalUsers = await ListingUser.countDocuments();
        const totalUnapprovedPosts = await Post.countDocuments({ isApprovedByAdmin: false });
        const totalApprovedPosts = await Post.countDocuments({ isApprovedByAdmin: true });
        const totalFreeListing = await ListingUser.countDocuments({ ListingPlan: 'Free' });
        const totalGoldListing = await ListingUser.countDocuments({ ListingPlan: 'Gold' });
        const totalSilverListing = await ListingUser.countDocuments({ ListingPlan: 'Silver' });
        const totalCityWeDeal  =  await City.countDocuments()
        const totalCategoriesWeDeal  =  await Categorey.countDocuments()

        const totalPosts = totalApprovedPosts + totalUnapprovedPosts;
        const percentageUnapproved = ((totalUnapprovedPosts / totalPosts) * 100).toFixed(2);

        const response = {
            success: true,
            data: {
                packageLength: packages.length,
                partnerLength: partners.length,
                totalUsers,
                totalPosts,
                totalUnapprovedPosts,
                totalApprovedPosts,
                percentageUnapproved,
                totalFreeListing,
                totalGoldListing,
                totalSilverListing,
                totalCategoriesWeDeal,
                totalCityWeDeal,
                totalPaymentAmountRupees, // Total amount of all payments
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};