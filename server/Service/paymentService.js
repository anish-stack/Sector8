const Razorpay = require('razorpay');
const Plans = require('../models/Pacakge');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_gQGRDFaoEskOdr",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "seWgj8epMRq7Oeb7bvC3IZCe",
    });
  }

  async createOrder(listingPlan, userName) {
    const plansRates = await Plans.find();
    const plan = plansRates.find(plan => plan.packageName === listingPlan);
    
    // if (!plan) {
    //   throw new Error('Invalid Listing Plan');
    // }

    const options = {
      amount: 50000,
      currency: 'INR',
      receipt: `user_${userName}_${Date.now()}`,
    };

    return this.razorpay.orders.create(options);
  }
}

module.exports = new PaymentService();