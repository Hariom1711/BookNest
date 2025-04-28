// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const connectDB = require('./config/db');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// // Initialize Express
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use(helmet());
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Routes
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/books', require('./routes/bookRoutes'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));
// // Base route
// app.get('/', (req, res) => {
//   res.send('API is running');
// });

// // Error Handling Middleware
// app.use(notFound);
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Configure CORS with specific origins
const allowedOrigins = [
  'https://book-nest-wheat.vercel.app',  // Replace with your actual Vercel frontend URL
  'http://localhost:5173'  // For local development
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
// Base route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});