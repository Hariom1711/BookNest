


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Users, MenuIcon, List, ChevronRight, User, BookMarked, LogOut, Bell } from 'lucide-react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import BookCard from '@/components/books/BookCard';
import { sampleBooks } from '@/lib/sampleBook';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genre?: string[];
  availableCopies?: number;
  totalCopies?: number;
}

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/books');
        setBooks(data);
        setFilteredBooks(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);



  // Use sample books if no books are fetched from API
  const displayBooks = books.length > 0 ? books : sampleBooks;

  // Real-time search function
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(displayBooks);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const results = displayBooks.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.genre?.some(g => g.toLowerCase().includes(query))
    );
    
    setFilteredBooks(results);
  }, [searchQuery, displayBooks]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar - Modern Glass Morphism Style */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-900/90 border-b border-zinc-800/50 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-900/20">
              <span className="text-white text-xl font-bold">B</span>
            </div>
            <h2 className="text-2xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">BookNest</h2>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium">Home</Link>
            <Link to="/books" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium">Books</Link>
            <Link to="/categories" className="text-white hover:text-purple-400 transition-colors duration-200 font-medium">Categories</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 bg-zinc-800/60 hover:bg-zinc-700/60 transition-colors duration-200 rounded-full pr-4 pl-1 py-1">
                      <Avatar className="h-8 w-8 border-2 border-purple-500">
                        <AvatarImage src={user?.avatar || "/api/placeholder/40/40"} />
                        <AvatarFallback className="bg-purple-800 text-white">{user.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-zinc-300">{user.name || 'User'}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mr-4 bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <DropdownMenuLabel className="text-purple-400">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-zinc-800 hover:text-purple-300 cursor-pointer">
                      <User size={16} className="mr-2" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-books')} className="hover:bg-zinc-800 hover:text-purple-300 cursor-pointer">
                      <BookMarked size={16} className="mr-2" />
                      <span>My Books</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/notifications')} className="hover:bg-zinc-800 hover:text-purple-300 cursor-pointer">
                      <Bell size={16} className="mr-2" />
                      <span>Notifications</span> 
                      <span className="ml-auto bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem onClick={() => navigate('/logout')} className="text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer">
                      <LogOut size={16} className="mr-2" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                onClick={() => navigate('/signin')} 
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-md shadow-purple-900/20 hover:shadow-lg transition-all duration-300 text-white"
              >
                Sign In
              </Button>
            )}
            <button className="md:hidden text-white p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 border-t border-zinc-800 mt-2 py-3">
            <div className="container mx-auto flex flex-col space-y-3">
              <Link to="/" className="text-white hover:text-purple-400 px-4 py-2 hover:bg-zinc-800 rounded-lg">Home</Link>
              <Link to="/books" className="text-white hover:text-purple-400 px-4 py-2 hover:bg-zinc-800 rounded-lg">Books</Link>
              <Link to="/categories" className="text-white hover:text-purple-400 px-4 py-2 hover:bg-zinc-800 rounded-lg">Categories</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section - Modern Gradient */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-zinc-900 rounded-2xl text-white p-8 mb-12 shadow-xl shadow-purple-900/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">Welcome to BookNest</h1>
            <p className="text-xl mb-8 text-purple-100">
              Discover, borrow, and share books with your community.
            </p>

            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-zinc-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for books by title, author or genre..."
                className="w-full pl-12 pr-16 py-6 rounded-xl bg-zinc-800/80 backdrop-blur-sm border-zinc-700/50 text-white placeholder:text-zinc-500 shadow-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results - Conditionally Displayed */}
        {isSearching && (
          <div className="mb-12 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Search size={18} className="mr-2 text-purple-400" />
              Search Results for "{searchQuery}"
              <span className="ml-2 text-sm text-zinc-400">({filteredBooks.length} books found)</span>
            </h2>
            
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-zinc-500 text-lg">No books found matching your search.</div>
                <p className="text-zinc-600 mt-2">Try a different search term or browse our categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured Categories with glass morphism cards */}
        {!isSearching && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">Browse by Category</span>
              </h2>
              <Link to="/books" className="text-purple-400 hover:text-purple-300 flex items-center group">
                View all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction'].map((category) => (
                <div 
                  key={category}
                  className="backdrop-blur-sm bg-zinc-900/60 p-6 rounded-xl border border-zinc-800/50 text-center cursor-pointer hover:border-purple-600/50 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen size={20} className="text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-purple-300 transition-colors duration-300">{category}</h3>
                  <p className="text-zinc-400 text-sm">Explore {category} books</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Books */}
        {!isSearching && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">Latest Books</h2>
              <Link to="/books" className="text-purple-400 hover:text-purple-300 flex items-center group">
                View all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 border-4 border-zinc-600 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-zinc-400">Loading books...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {displayBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Features Section with Frosted Glass Cards */}
        {!isSearching && (
          <div className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">Why Choose BookNest?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center backdrop-blur-sm bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/30 hover:border-purple-500/30 hover:bg-zinc-800/50 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 text-purple-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors duration-300">Wide Selection</h3>
                <p className="text-zinc-400">Access thousands of books across multiple genres and topics.</p>
              </div>
              <div className="text-center backdrop-blur-sm bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/30 hover:border-purple-500/30 hover:bg-zinc-800/50 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 text-purple-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <List size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors duration-300">Easy Borrowing</h3>
                <p className="text-zinc-400">Simple checkout process with flexible return periods.</p>
              </div>
              <div className="text-center backdrop-blur-sm bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/30 hover:border-purple-500/30 hover:bg-zinc-800/50 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 text-purple-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Users size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors duration-300">Community Focus</h3>
                <p className="text-zinc-400">Share your favorite reads and connect with fellow book lovers.</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section with Enhanced Design */}
        {!isSearching && (
          <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-zinc-900 rounded-xl text-white p-8 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IiNmZmZmZmYxNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">Join our community today and explore our collection of books curated just for you.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="px-8 py-6 bg-white hover:bg-purple-50 text-purple-900 font-medium rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 flex items-center justify-center"
                  onClick={() => navigate('/books')}
                >
                  <BookOpen size={18} className="mr-2" />
                  Browse Books
                </Button>
                <Button 
                  variant="outline"
                  className="px-8 py-6 border-white/30 hover:bg-white/10 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;