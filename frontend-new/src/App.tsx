import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage'; // Import the BookPage component

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<HomePage />} />
          
          {/* Books routes */}
          <Route path="/books" element={<BookPage />} />
          <Route path="/books/:genre" element={<BookPage />} /> {/* Genre-specific route */}
          
          {/* Add more routes as needed */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          {/* Protected routes can be added here */}
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;