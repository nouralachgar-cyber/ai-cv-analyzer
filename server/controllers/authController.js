const User = require('../models/User');
const generateToken = require('../utils/jwt');
const bcrypt = require('bcryptjs');

// @desc    إنشاء حساب جديد (Register)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'المرجو ملء جميع الحقول' });
    }

    // التأكد من عدم وجود المستخدم سابقاً
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }

    // تشفير كلمة السر
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'بيانات المستخدم غير صالحة' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    تسجيل الدخول (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // التحقق من البريد وكلمة السر المشفّرة
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'البريد الإلكتروني أو كلمة السر غير صحيحة' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    جلب بيانات المستخدم الحالي (Profile)
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};