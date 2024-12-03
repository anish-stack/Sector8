const jwt = require('jsonwebtoken');
const Settings = require('../models/Settings.model');

class AuthService {
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { success: true, id: decoded.id };
    } catch (error) {
      const settings = await Settings.findOne();
      return { success: false, id: settings?.adminId || null };
    }
  }

  extractToken(req) {
    return req.cookies.token || 
           req.body.token || 
           (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');
  }
}

module.exports = new AuthService();