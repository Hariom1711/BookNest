const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const books = require('./data/books');
const User = require('./models/userModel');
const Book = require('./models/bookModel');
const Transaction = require('./models/transactionModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear all collections
    await Transaction.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    // Import users
    const createdUsers = await User.insertMany(users);
    console.log('Users imported!');

    // Import books
    await Book.insertMany(books);
    console.log('Books imported!');

    console.log('Data Import Success!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all collections
    await Transaction.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}