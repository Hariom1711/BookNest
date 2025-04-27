const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  genre: [{
    type: String
  }],
  publishedDate: {
    type: Date
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1
  },
  description: {
    type: String
  },
  coverImage: {
    type: String
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;