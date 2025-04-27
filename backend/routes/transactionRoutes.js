const express = require('express');
const router = express.Router();
const {
  borrowBook,
  returnBook,
  getMyBooks,
  getTransactions,
} = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getTransactions);
router.post('/borrow', protect, borrowBook);
router.put('/return/:id', protect, returnBook);
router.get('/mybooks', protect, getMyBooks);

module.exports = router;