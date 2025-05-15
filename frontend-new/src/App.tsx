import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage'; // Import the BookPage component
import MyBooksPage from './components/books/MyBooks';
import { Suspense } from 'react';
import Header from './components/layout/Header';

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
    <AuthProvider>
   

      <Router>
        <div className="min-h-screen bg-black text-white">
          {/* Header is now globally accessible across all routes */}
          <Header />
          
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="w-12 h-12 border-4 border-zinc-600 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          }>
              <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<HomePage />} />
          
          {/* Books routes */}
          <Route path="/books" element={<BookPage />} />
          <Route path="/books/:genre" element={<BookPage />} /> {/* Genre-specific route */}
          <Route path="/mybooks" element={<MyBooksPage />} />
          {/* Add more routes as needed */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          {/* Protected routes can be added here */}
        </Routes>
          </Suspense>
        </div>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;