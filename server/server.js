const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// تحميل المتغيرات البيئية من ملف .env
dotenv.config();

// الاتصال بقاعدة البيانات MongoDB Atlas
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// إتاحة مجلد المرفقات والملفات المرفوعة للعموم
app.use('/uploads', express.static('uploads'));

// --- ربط جميع مسارات الـ API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// المسار الرئيسي لتجربة السيرفر
app.get('/', (req, res) => {
  res.send('AI CV Analyzer API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});