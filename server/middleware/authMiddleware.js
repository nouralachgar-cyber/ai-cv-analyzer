const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // استخراج الـ Token من الهيدر (Authorization: Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // فك تشفير الـ Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // جلب بيانات المستخدم بدون كلمة السر
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({ message: 'غير مصرح لك، التوكن غير صالح' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح لك، لا يوجد توكن' });
  }
};

module.exports = { protect };