const asyncHandler = require('express-async-handler');
const Book = require('../models/bookModel');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { author: { $regex: req.query.keyword, $options: 'i' } },
          { ISBN: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  // Genre filter
  if (req.query.genre && req.query.genre !== 'all') {
    keyword.genre = { $in: [req.query.genre] };
  }

  // Availability filter
  if (req.query.availability === 'available') {
    keyword.availableCopies = { $gt: 0 };
  }

  const books = await Book.find(keyword);
  res.json(books);
});

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json([book]);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Librarian
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    ISBN,
    genre,
    publishedDate,
    totalCopies,
    description,
    coverImage,
  } = req.body;

  const bookExists = await Book.findOne({ ISBN });

  if (bookExists) {
    res.status(400);
    throw new Error('Book with this ISBN already exists');
  }

  const book = await Book.create({
    title,
    author,
    ISBN,
    genre: Array.isArray(genre) ? genre : [genre],
    publishedDate,
    totalCopies: totalCopies || 1,
    availableCopies: totalCopies || 1,
    description,
    coverImage,
  });

  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400);
    throw new Error('Invalid book data');
  }
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Librarian
const updateBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    ISBN,
    genre,
    publishedDate,
    totalCopies,
    availableCopies,
    description,
    coverImage,
  } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.ISBN = ISBN || book.ISBN;
    book.genre = genre || book.genre;
    book.publishedDate = publishedDate || book.publishedDate;
    book.totalCopies = totalCopies || book.totalCopies;
    book.availableCopies = availableCopies !== undefined ? availableCopies : book.availableCopies;
    book.description = description || book.description;
    book.coverImage = coverImage || book.coverImage;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Librarian
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};