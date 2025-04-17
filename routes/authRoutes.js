// routes/authRoutes.js
import { Router } from 'express';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = Router();

//--------------------------- Verify Token Route---------------------------------//
router.get('/verify', verifyToken, (req, res) => {
  res.json({ msg: 'Token is valid ✅', user: req.user });
});
// ----------------------------Register New User----------------------------------//
router.post('/register', async (req, res) => {
  
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Username or Password Wrong" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

//----------------------------- Login User---------------------------------------//
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const Admin = await User.findOne({ email });

    if (!Admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, Admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // إنشاء التوكن
    const token = jwt.sign({ id: Admin._id, email: Admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // إرسال التوكن إلى الكوكيز
    res.cookie('token', token, {
      httpOnly: true,  // يحمي من الهجمات
      secure: process.env.NODE_ENV === 'production',  // تأكد من إرسال الكوكيز في بيئة الإنتاج
      maxAge: 93600000,  // صلاحية التوكن ساعة
    });
    res.json({token})
    res.json({ message: 'Login successful' });

  } catch (err) {
    res.status(500).json({ message: 'Error logging in User', error: err });
  }
});

export default router;
