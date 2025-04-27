const express = require('express');
const router = express.Router();
const { 
  authUser, 
  registerUser, 
  getUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Fix these routes
router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;