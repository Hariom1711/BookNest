const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

// @desc    Borrow a book
// @route   POST /api/transactions/borrow
// @access  Private
const borrowBook = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  
  // Check if book exists and is available
  const book = await Book.findById(bookId);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  if (book.availableCopies <= 0) {
    res.status(400);
    throw new Error('Book is not available for borrowing');
  }
  
  // Check if user already has 5 books borrowed (max limit)
  const user = await User.findById(req.user._id);
  const activeBorrows = user.borrowedBooks.filter(
    book => book.status === 'borrowed'
  );
  
  if (activeBorrows.length >= 5) {
    res.status(400);
    throw new Error('You have reached the maximum limit of borrowed books (5)');
  }
  
  // Check if user already has this book
  const alreadyBorrowed = user.borrowedBooks.find(
    item => item.book.toString() === bookId && item.status === 'borrowed'
  );
  
  if (alreadyBorrowed) {
    res.status(400);
    throw new Error('You have already borrowed this book');
  }
  
  // Calculate due date (14 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  
  // Create transaction
  const transaction = await Transaction.create({
    book: bookId,
    user: req.user._id,
    dueDate,
    status: 'borrowed',
  });
  
  // Update book available copies
  book.availableCopies -= 1;
  await book.save();
  
  // Add book to user's borrowed books
  user.borrowedBooks.push({
    book: bookId,
    borrowDate: Date.now(),
    dueDate,
    status: 'borrowed',
  });
  
  await user.save();
  
  res.status(201).json(transaction);
});

// @desc    Return a book
// @route   PUT /api/transactions/return/:id
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
  const { id } = req.params; // Transaction ID
  
  // Find the transaction
  const transaction = await Transaction.findById(id);
  
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  
  // Check if the transaction belongs to the logged-in user
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  // Check if the book is already returned
  if (transaction.status === 'returned') {
    res.status(400);
    throw new Error('Book is already returned');
  }
  
  // Update transaction
  transaction.status = 'returned';
  transaction.returnDate = Date.now();
  
  // Calculate fine if book is returned late
  const currentDate = new Date();
  const dueDate = new Date(transaction.dueDate);
  
  if (currentDate > dueDate) {
    const daysLate = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
    transaction.fine = daysLate * 0.5; // $0.50 per day late
  }
  
  await transaction.save();
  
  // Update book available copies
  const book = await Book.findById(transaction.book);
  book.availableCopies += 1;
  await book.save();
  
  // Update user's borrowed books
  const user = await User.findById(req.user._id);
  const borrowedBookIndex = user.borrowedBooks.findIndex(
    item => item.book.toString() === transaction.book.toString() && item.status === 'borrowed'
  );
  
  if (borrowedBookIndex > -1) {
    user.borrowedBooks[borrowedBookIndex].status = 'returned';
    user.borrowedBooks[borrowedBookIndex].returnDate = Date.now();
    await user.save();
  }
  
  res.json(transaction);
});

// @desc    Get user's borrowed books
// @route   GET /api/transactions/mybooks
// @access  Private
const getMyBooks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('borrowedBooks.book');
  
  if (user) {
    res.json(user.borrowedBooks);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all transactions (for librarians)
// @route   GET /api/transactions
// @access  Private/Librarian
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate('book', 'title author ISBN')
    .populate('user', 'name email');
  
  res.json(transactions);
});

module.exports = {
  borrowBook,
  returnBook,
  getMyBooks,
  getTransactions,
};