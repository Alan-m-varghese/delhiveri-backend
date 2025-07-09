const express = require('express');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const SECRET_KEY = process.env.ENCRYPT_SECRET;

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  const newUser = new User({ name, email, password: encryptedPassword });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const decryptedPassword = CryptoJS.AES.decrypt(user.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  if (decryptedPassword !== password) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Profile
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const User = require('../models/User');

// ⬇️ Secure route to get profile
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');  // remove password

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || null
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});


module.exports = router;
