const Razorpay = require('razorpay');
const Plans = require('../models/Pacakge');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_cz0vBQnDwFMthJ",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "aIM7S3NfvUHlM84tcZRQpNht",
    });
  }

  async createOrder(listingPlan, userName) {
    console.log("Received Listing Plan:", listingPlan);
    console.log("Received User Name:", userName);

    // Extract package name from the listing plan string
    const extractedPlanName = listingPlan.split('-')[0].trim();
    console.log("Extracted Plan Name:", extractedPlanName);

    const plansRates = await Plans.find();
    console.log("Plans from Database:", plansRates);

    // Find the matching plan in the database
    const planDb = plansRates.find(plan => plan.packageName === extractedPlanName);

    if (!planDb) {
      throw new Error('Invalid Listing Plan');
    }

    // Prepare Razorpay order options
    const options = {
      amount: parseInt(planDb.packagePrice) * 100, // Convert to paise
      currency: 'INR',
      receipt: `user_${userName}_${Date.now()}`,
    };

    console.log("Creating Razorpay Order with Options:", options);

    // Create and return the Razorpay order
    return this.razorpay.orders.create(options);
  }
}

module.exports = new PaymentService();
