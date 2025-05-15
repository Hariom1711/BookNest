// Basic Book interface
export interface Book {
    _id: string;
    title: string;
    author: string;
    ISBN?: string;
    genre?: string[];
    publishedDate?: string;
    totalCopies?: number;
    availableCopies?: number;
    description: string;
    coverImage: string;
    publisher?: string;
    language?: string;
    pageCount?: number;
  }
  
  // User interface
  export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: 'user' | 'admin' | 'librarian';
    membershipDate?: string;
  }
  
  // Transaction interface (for borrowed books)
  export interface Transaction {
    _id: string;
    book: Book;
    user: User;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'borrowed' | 'returned';
    fine: number;
  }
  
  // For API responses
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  // Filter and sorting options
  export interface BookFilters {
    genre?: string;
    author?: string;
    publishedYear?: number;
    available?: boolean;
    searchQuery?: string;
  }
  
  export interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
  }
  
  // Context types
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Partial<User>) => Promise<void>;
    logout: () => void;
  }
  
  // Props for components
  export interface BookCardProps {
    book: Book;
    onBorrow?: (bookId: string) => void;
    onReturn?: (bookId: string) => void;
  }
  
  export interface TransactionCardProps {
    transaction: Transaction;
    onReturn?: (transactionId: string) => void;
  }
  
  // Route params
  export interface BookDetailParams {
    bookId: string;
  }
  
  // State interfaces
  export interface BookState {
    books: Book[];
    loading: boolean;
    error: string | null;
    filters: BookFilters;
    sort: SortOptions;
  }
  
  export interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    isReturning: boolean;
    selectedTransaction: Transaction | null;
  }