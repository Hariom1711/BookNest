import { useState, useEffect, JSX } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Book, ChevronLeft, AlertCircle, Calendar, Clock, CheckCircle, BookMarked, Loader2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { Transaction } from '@/types';


const MyBooksPage = () => {
    const [borrowedBooks, setBorrowedBooks] = useState<Transaction[]>([]);
    const [selectedBook, setSelectedBook] = useState<Transaction | null>(null);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      setLoading(true);
      const token = Cookies.get('token') || localStorage.getItem('token');
      const { data } = await axios.get(`${baseURL}/api/transactions/mybooks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBorrowedBooks(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
console.log(borrowedBooks, "borrowedBooks")
  const handleReturnBook = async (transactionId: any) => {
    const baseURL = 'http://localhost:5000';
    try {
      setIsReturning(true);
      const token = Cookies.get('token') || localStorage.getItem('token');
      await axios.put(`${baseURL}/api/transactions/return/${transactionId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the local state
      fetchBorrowedBooks();
      
      if ((selectedBook?.fine ?? 0) > 0) {
        toast.warning(`Book returned with a fine of ${selectedBook?.fine.toFixed(2)}`);
      } else {
        toast.success("Book returned successfully. Thank you for returning on time!");
      }
      
      setShowConfirmDialog(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error returning book");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsReturning(false);
    }
  };

  const confirmReturn = (book: Transaction | null) => {
    setSelectedBook(book);
    setShowConfirmDialog(true);
  };

  // Function to calculate days left until due date
interface CalculateDaysLeftParams {
    dueDate: string;
}

const calculateDaysLeft = (dueDate: CalculateDaysLeftParams['dueDate']): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

  // Function to format date in a readable way
interface FormatDateParams {
    dateString: string;
}

const formatDate = (dateString: FormatDateParams['dateString']): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

  // Function to determine status badge styling
interface StatusBadgeProps {
    status: string;
    dueDate: string;
}

const getStatusBadge = (status: StatusBadgeProps['status'], dueDate: StatusBadgeProps['dueDate']): JSX.Element => {
    if (status === 'returned') {
        return (
            <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-800/50 hover:bg-green-900/40">
                Returned
            </Badge>
        );
    }
    
    const daysLeft = calculateDaysLeft(dueDate);
    
    if (daysLeft < 0) {
        return (
            <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-800/50 hover:bg-red-900/40">
                Overdue by {Math.abs(daysLeft)} days
            </Badge>
        );
    } else if (daysLeft <= 3) {
        return (
            <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-800/50 hover:bg-yellow-900/40">
                Due soon ({daysLeft} days)
            </Badge>
        );
    } else {
        return (
            <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800/50 hover:bg-blue-900/40">
                Borrowed
            </Badge>
        );
    }
};

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Header with Purple Glass Effect */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-zinc-900 py-12 px-4 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4 text-purple-200 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">My Books</h1>
              <p className="text-purple-200 mt-2">Manage your borrowed books and returns</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-zinc-900/40 backdrop-blur-sm rounded-lg border border-zinc-800/50 p-3">
              <Avatar className="h-10 w-10 border-2 border-purple-500 mr-3">
                <AvatarImage src={user?.avatar || "/api/placeholder/40/40"} />
                <AvatarFallback className="bg-purple-800 text-white">{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-zinc-400">
                  {borrowedBooks.filter(b => b.status === 'borrowed').length} Active Loans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Filter Tabs */}
        <div className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex overflow-x-auto space-x-2 pb-1">
            <Button variant="ghost" className="text-white bg-purple-800/40 hover:bg-purple-700/40 rounded-lg whitespace-nowrap">
              All Books ({borrowedBooks.length})
            </Button>
            <Button variant="ghost" className="text-white hover:bg-zinc-800/80 rounded-lg whitespace-nowrap">
              Currently Borrowed ({borrowedBooks.filter(b => b.status === 'borrowed').length})
            </Button>
            <Button variant="ghost" className="text-white hover:bg-zinc-800/80 rounded-lg whitespace-nowrap">
              Returned ({borrowedBooks.filter(b => b.status === 'returned').length})
            </Button>
            <Button variant="ghost" className="hover:bg-zinc-800/80 rounded-lg whitespace-nowrap text-yellow-300">
              Due Soon ({borrowedBooks.filter(b => b.status === 'borrowed' && calculateDaysLeft(b.dueDate) <= 3 && calculateDaysLeft(b.dueDate) >= 0).length})
            </Button>
            <Button variant="ghost" className="hover:bg-zinc-800/80 rounded-lg whitespace-nowrap text-red-300">
              Overdue ({borrowedBooks.filter(b => b.status === 'borrowed' && calculateDaysLeft(b.dueDate) < 0).length})
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-zinc-600 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading your books...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="backdrop-blur-sm bg-red-900/20 border border-red-800/50 rounded-xl p-6 my-8 shadow-lg flex items-center">
            <AlertCircle size={24} className="text-red-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-200">Error loading books</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && borrowedBooks.length === 0 && (
          <div className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-12 my-8 shadow-lg text-center">
            <BookMarked size={48} className="text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Books Found</h3>
            <p className="text-zinc-400 mb-6">You haven't borrowed any books yet.</p>
            <Button 
              onClick={() => navigate('/books')}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-md shadow-purple-900/20 hover:shadow-lg"
            >
              Browse Books
            </Button>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && borrowedBooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((item) => (
              <Card key={item._id} className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 shadow-lg text-white hover:border-purple-900/50 hover:shadow-purple-900/10 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex justify-between items-start">
                    <div className="truncate pr-2">{item.book.title}</div>
                    {getStatusBadge(item.status, item.dueDate)}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    by {item.book.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex">
                    <div className="w-24 h-32 rounded-lg overflow-hidden bg-zinc-800 mr-4 flex-shrink-0">
                      <img 
                        src={item.book.coverImage || "/api/placeholder/96/128"} 
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center text-zinc-300">
                          <Calendar size={14} className="mr-2 text-purple-400" />
                          <span>Borrowed: {formatDate(item.borrowDate)}</span>
                        </li>
                        <li className="flex items-center text-zinc-300">
                          <Clock size={14} className="mr-2 text-purple-400" />
                          <span>Due: {formatDate(item.dueDate)}</span>
                        </li>
                        {item.status === 'returned' && (
                          <li className="flex items-center text-zinc-300">
                            <CheckCircle size={14} className="mr-2 text-green-400" />
                            <span>Returned: {formatDate(item.returnDate || '')}</span>
                          </li>
                        )}
                        {item.fine > 0 && (
                          <li className="flex items-center text-red-300">
                            <AlertCircle size={14} className="mr-2 text-red-400" />
                            <span>Fine: ${item.fine.toFixed(2)}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800/50 pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                    onClick={() => navigate(`/books/${item.book._id}`)}
                  >
                    <Book size={16} className="mr-2" />
                    Book Details
                  </Button>
                  
                  {item.status === 'borrowed' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-sm shadow-purple-900/20 hover:shadow-md"
                            onClick={() => confirmReturn(item)}
                            disabled={isReturning}
                          >
                            {isReturning && item._id === selectedBook?._id ? (
                              <Loader2 size={16} className="mr-2 animate-spin" />
                            ) : (
                              <CheckCircle size={16} className="mr-2" />
                            )}
                            Return Book
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Return this book to the library</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Return Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Return book confirmation</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to return "{selectedBook?.book?.title}"?
              {selectedBook?.dueDate && calculateDaysLeft(selectedBook?.dueDate) < 0 && (
                <div className="mt-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                  <AlertCircle size={16} className="inline-block mr-2" />
                  This book is overdue by {Math.abs(calculateDaysLeft(selectedBook?.dueDate))} days.
                  A late fee may apply.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleReturnBook(selectedBook?._id)}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
              disabled={isReturning}
            >
              {isReturning ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Returning...
                </>
              ) : (
                'Confirm Return'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBooksPage;