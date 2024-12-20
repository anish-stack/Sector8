const Post  = require('../models/listing.model')
const ListingUser = require('../models/User.model'); // Adjust the path as per your project structure
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
const Partner = require('../models/Partner.model')
const Package = require('../models/Pacakge')
const City = require('../models/CityModel')
const Category = require('../models/CategoreiesModel')

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
        const [paymentsResponse, partners, packages, posts, totalUsers, totalUnapprovedPosts, totalApprovedPosts, totalFreeListing, totalGoldListing, totalSilverListing, totalCityWeDeal, totalCategoriesWeDeal] = await Promise.all([
            axios.get(`${process.env.BACKEND_URL}/api/v1/admin-all-payments`), // Fetch payments concurrently
            Partner.find(), // Fetch partners concurrently
            Package.find(), // Fetch packages concurrently
            Post.find(), // Fetch posts concurrently
            ListingUser.countDocuments(), // Fetch total users concurrently
            Post.countDocuments({ isApprovedByAdmin: false }), // Count unapproved posts concurrently
            Post.countDocuments({ isApprovedByAdmin: true }), // Count approved posts concurrently
            ListingUser.countDocuments({ ListingPlan: 'Free' }), // Count free listings concurrently
            ListingUser.countDocuments({ ListingPlan: 'Gold' }), // Count gold listings concurrently
            ListingUser.countDocuments({ ListingPlan: 'Silver' }), // Count silver listings concurrently
            City.countDocuments(), // Count total cities concurrently
            Category.countDocuments(), // Count total categories concurrently
        ]);

 
        // Calculate total posts and percentage of unapproved posts
        const totalPosts = totalApprovedPosts + totalUnapprovedPosts;
        const percentageUnapproved = totalPosts ? ((totalUnapprovedPosts / totalPosts) * 100).toFixed(2) : '0';

        const response = {
            success: true,
            data: {
                packageLength: packages.length || 0,
                partnerLength: partners.length || 0,
                totalUsers: totalUsers || 0,
                totalPosts: totalPosts || 0,
                totalUnapprovedPosts: totalUnapprovedPosts || 0,
                totalApprovedPosts: totalApprovedPosts || 0,
                percentageUnapproved,
                totalFreeListing: totalFreeListing || 0,
                totalGoldListing: totalGoldListing || 0,
                totalSilverListing: totalSilverListing || 0,
                totalCategoriesWeDeal: totalCategoriesWeDeal || 0,
                totalCityWeDeal: totalCityWeDeal || 0,
                totalPaymentAmountRupees:  0,
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: {
                packageLength: 0,
                partnerLength: 0,
                totalUsers: 0,
                totalPosts: 0,
                totalUnapprovedPosts: 0,
                totalApprovedPosts: 0,
                percentageUnapproved: '0',
                totalFreeListing: 0,
                totalGoldListing: 0,
                totalSilverListing: 0,
                totalCategoriesWeDeal: 0,
                totalCityWeDeal: 0,
                totalPaymentAmountRupees: 0,
            }
        });
    }
};