
// import { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import {
//   Search,
//   BookOpen,
//   Filter,
//   X,
//   SlidersHorizontal,
//   BookMarked,
//   ArrowLeft,
//   BookCheck,
//   Calendar,
// //   User,
//   Hash,
// } from "lucide-react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { sampleBooks } from "@/lib/sampleBook";
// import { toast } from "sonner";

// interface Book {
//   _id: string;
//   title: string;
//   author: string;
//   ISBN?: string;
//   genre?: string[];
//   publishedDate?: string;
//   totalCopies?: number;
//   availableCopies?: number;
//   description: string;
//   coverImage: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// const BookPage = () => {
//   const params = useParams<{ id?: string; genre?: string }>();
// const id = params.id;
// const genre = params.genre ? params.genre.charAt(0).toUpperCase() + params.genre.slice(1) : "";

// console.log(id,genre,"use params data")
//   const navigate = useNavigate();

//   // State for books and loading
//   const [books, setBooks] = useState<Book[]>([]);
//   const [currentBook, setCurrentBook] = useState<Book | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // State for filters
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenres, setSelectedGenres] = useState<string[]>(
//     genre ? [genre] : []
//   );
//   const [selectedAvailability, setSelectedAvailability] = useState<
//     "all" | "available"
//   >("all");
//   const [sortBy, setSortBy] = useState<string>("relevance");
//   const [yearRange, setYearRange] = useState<[number, number]>([
//     1900,
//     new Date().getFullYear(),
//   ]);

//   // State for UI
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
//   const [allGenres, setAllGenres] = useState<string[]>([]);
//   const [activeFiltersCount, setActiveFiltersCount] = useState(0);

//   // Mobile responsive state
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch books from API
//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5000/api/books");
//         setBooks(data.length > 0 ? data : sampleBooks);

//         // Extract all unique genres
//         const genreSet = new Set<string>();
//         data.forEach((book: Book) => {
//           book.genre?.forEach((g) => genreSet.add(g));
//         });
//         setAllGenres(Array.from(genreSet));

//         setLoading(false);
//       } catch (error: any) {
//         setError(error.response?.data?.message || error.message);
//         // Fallback to sample books
//         setBooks(sampleBooks);

//         // Extract genres from sample books
//         const genreSet = new Set<string>();
//         sampleBooks.forEach((book: Book) => {
//           book.genre?.forEach((g) => genreSet.add(g));
//         });
//         setAllGenres(Array.from(genreSet));

//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   // Fetch single book if ID is provided
//   useEffect(() => {
//     if (id) {
//       // First check if it's a valid MongoDB ID format (typically 24 hex chars)
//       const isValidId = /^[0-9a-fA-F]{24}$/.test(id);
      
//       if (isValidId) {
//         const foundBook = books.find((book) => book._id === id);
        
//         if (foundBook) {
//           setCurrentBook(foundBook);
//           setLoading(false);
//         } else if (books.length === 0) {
//           setLoading(true);
//         } else {
//           setError("Book not found");
//           setLoading(false);
//         }
//       } else {
//         // If it's not a valid ID format, assume it might be a genre
//         // and let the genre filter handle it
//         setCurrentBook(null);
//       }
//     } else {
//       setCurrentBook(null);
//     }
//   }, [id, books]);
//   useEffect(() => {
//     if (genre) {
//       // Filter books based on the genre from the URL
//       const filteredByGenre = books.filter((book) =>
//         book.genre?.includes(genre)
//       );
//       setFilteredBooks(filteredByGenre);
//     } else {
//       // If no genre is provided, show all books
//       setFilteredBooks(books);
//     }
//   }, [genre, books]);

//   // Apply filters whenever filter state changes
//   useEffect(() => {
//     let filtered = [...books];

//     // Search query filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (book) =>
//           book.title.toLowerCase().includes(query) ||
//           book.author.toLowerCase().includes(query) ||
//           book.description.toLowerCase().includes(query) ||
//           book.genre?.some((g) => g.toLowerCase().includes(query))
//       );
//     }

//     // Genre filter
//     if (selectedGenres.length > 0) {
//       filtered = filtered.filter((book) =>
//         book.genre?.some((g) => selectedGenres.includes(g))
//       );
//     }

//     // Availability filter
//     if (selectedAvailability === "available") {
//       filtered = filtered.filter(
//         (book) => book.availableCopies && book.availableCopies > 0
//       );
//     }

//     // Year range filter if we have publishedDate data
//     filtered = filtered.filter((book) => {
//       if (!book.publishedDate) return true;
//       const year = new Date(book.publishedDate).getFullYear();
//       return year >= yearRange[0] && year <= yearRange[1];
//     });

//     // Sort results
//     switch (sortBy) {
//       case "title_asc":
//         filtered.sort((a, b) => a.title.localeCompare(b.title));
//         break;
//       case "title_desc":
//         filtered.sort((a, b) => b.title.localeCompare(a.title));
//         break;
//       case "newest":
//         filtered.sort((a, b) => {
//           const dateA = a.publishedDate
//             ? new Date(a.publishedDate).getTime()
//             : 0;
//           const dateB = b.publishedDate
//             ? new Date(b.publishedDate).getTime()
//             : 0;
//           return dateB - dateA;
//         });
//         break;
//       case "oldest":
//         filtered.sort((a, b) => {
//           const dateA = a.publishedDate
//             ? new Date(a.publishedDate).getTime()
//             : 0;
//           const dateB = b.publishedDate
//             ? new Date(b.publishedDate).getTime()
//             : 0;
//           return dateA - dateB;
//         });
//         break;
//       case "availability":
//         filtered.sort((a, b) => {
//           const availA = a.availableCopies || 0;
//           const availB = b.availableCopies || 0;
//           return availB - availA;
//         });
//         break;
//       default: // relevance or any other case
//         // Leave as is - already sorted by relevance
//         break;
//     }

//     setFilteredBooks(filtered);

//     // Count active filters
//     let count = 0;
//     if (searchQuery.trim()) count++;
//     if (selectedGenres.length > 0) count++;
//     if (selectedAvailability === "available") count++;
//     if (yearRange[0] !== 1900 || yearRange[1] !== new Date().getFullYear())
//       count++;
//     setActiveFiltersCount(count);
//   }, [
//     books,
//     searchQuery,
//     selectedGenres,
//     selectedAvailability,
//     sortBy,
//     yearRange,
//   ]);

//   // Handle URL with genre parameter
//   useEffect(() => {
//     if (genre && !selectedGenres.includes(genre)) {
//       setSelectedGenres([...selectedGenres, genre]);
//     }
//   }, [genre]);

//   // Toggle genre selection
//   const toggleGenre = (genre: string) => {
//     if (selectedGenres.includes(genre)) {
//       setSelectedGenres(selectedGenres.filter((g) => g !== genre));
//     } else {
//       setSelectedGenres([...selectedGenres, genre]);
//     }
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchQuery("");
//     setSelectedGenres([]);
//     setSelectedAvailability("all");
//     setYearRange([1900, new Date().getFullYear()]);
//     setSortBy("relevance");
//   };

//   // Handle borrow book action
//   const handleBorrowBook = async (bookId: string) => {
//     // In a real application, this would make an API call to update the book's availability
//     try {
//       // Mock API call for demonstration
//       // await axios.post(`http://localhost:5000/api/books/${bookId}/borrow`);

//       // Update local state to reflect the borrow
//       const updatedBooks = books.map((book) => {
//         if (
//           book._id === bookId &&
//           book.availableCopies &&
//           book.availableCopies > 0
//         ) {
//           return { ...book, availableCopies: book.availableCopies - 1 };
//         }
//         return book;
//       });

//       setBooks(updatedBooks);

//       // If we're on a single book page, update the current book too
//       if (
//         currentBook &&
//         currentBook._id === bookId &&
//         currentBook.availableCopies &&
//         currentBook.availableCopies > 0
//       ) {
//         setCurrentBook({
//           ...currentBook,
//           availableCopies: currentBook.availableCopies - 1,
//         });
//       }


//       toast.success("Book borrowed successfully!", {
//         description: "You can pick up your book at the library counter.",
//       });
//     } catch (error: any) {
//       toast.error("Failed to borrow book", {
//         description:error.response?.data?.message || "Something went wrong",
//       });
//     }
//   };

//   // Render single book details page
//   if (id && currentBook) {
//     return (
//       <div className="min-h-screen bg-black text-white">
//         {/* Book Detail Header with Gradient */}
//         <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-zinc-900 py-8 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
//           <div className="container mx-auto px-4 relative z-10">
//             <Button
//               variant="ghost"
//               className="mb-4 text-purple-200 hover:text-white hover:bg-purple-900/30"
//               onClick={() => navigate("/books")}
//             >
//               <ArrowLeft size={16} className="mr-2" /> Back to Books
//             </Button>
//           </div>
//         </div>

//         {/* Book Detail Content */}
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Left Column - Book Cover */}
//             <div className="md:col-span-1">
//               <div className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden p-4">
//                 <div className="aspect-[2/3] overflow-hidden relative rounded-lg">
//                   <img
//                     src={currentBook.coverImage || "/api/placeholder/300/450"}
//                     alt={currentBook.title}
//                     className="w-full h-full object-cover"
//                   />
//                   {currentBook.availableCopies === 0 && (
//                     <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1">
//                       Not Available
//                     </div>
//                   )}
//                 </div>

//                 {/* Borrow Button */}
//                 <Button
//                   className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
//                   disabled={
//                     !currentBook.availableCopies ||
//                     currentBook.availableCopies <= 0
//                   }
//                   onClick={() => handleBorrowBook(currentBook._id)}
//                 >
//                   <BookCheck size={18} className="mr-2" />
//                   {currentBook.availableCopies &&
//                   currentBook.availableCopies > 0
//                     ? "Borrow This Book"
//                     : "Currently Unavailable"}
//                 </Button>
//               </div>
//             </div>

//             {/* Right Column - Book Details */}
//             <div className="md:col-span-2">
//               <div className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-6">
//                 <h1 className="text-3xl font-bold text-white mb-2">
//                   {currentBook.title}
//                 </h1>
//                 <h2 className="text-xl text-zinc-400 mb-4">
//                   by {currentBook.author}
//                 </h2>

//                 {/* Genres */}
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {currentBook.genre?.map((g) => (
//                     <Badge
//                       key={g}
//                       className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 cursor-pointer"
//                       onClick={() => {
//                         navigate(`/books?genre=${g}`);
//                       }}
//                     >
//                       {g}
//                     </Badge>
//                   ))}
//                 </div>

//                 {/* Description */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium text-white mb-2">
//                     Description
//                   </h3>
//                   <p className="text-zinc-300 leading-relaxed">
//                     {currentBook.description}
//                   </p>
//                 </div>

//                 {/* Book Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="flex items-center space-x-2 text-zinc-300">
//                     <Calendar size={18} className="text-purple-400" />
//                     <span>
//                       Published:{" "}
//                       {currentBook.publishedDate
//                         ? new Date(
//                             currentBook.publishedDate
//                           ).toLocaleDateString("en-US", {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           })
//                         : "Unknown"}
//                     </span>
//                   </div>

//                   <div className="flex items-center space-x-2 text-zinc-300">
//                     <Hash size={18} className="text-purple-400" />
//                     <span>ISBN: {currentBook.ISBN || "N/A"}</span>
//                   </div>

//                   <div className="flex items-center space-x-2 text-zinc-300">
//                     <BookMarked size={18} className="text-purple-400" />
//                     <span>
//                       Availability: {currentBook.availableCopies}/
//                       {currentBook.totalCopies} copies
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Related Books Section - Placeholder for future implementation */}
//               <div className="mt-8">
//                 <h3 className="text-xl font-medium text-white mb-4">
//                   You might also like
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                   {books
//                     .filter(
//                       (book) =>
//                         book._id !== currentBook._id &&
//                         book.genre?.some((g) => currentBook.genre?.includes(g))
//                     )
//                     .slice(0, 3)
//                     .map((book) => (
//                       <div
//                         key={book._id}
//                         className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-lg overflow-hidden hover:border-purple-600/30 transition-all duration-300 group"
//                         onClick={() => navigate(`/books/${book._id}`)}
//                       >
//                         <div className="flex items-center p-3 cursor-pointer">
//                           <div className="w-16 h-24 overflow-hidden rounded">
//                             <img
//                               src={
//                                 book.coverImage || "/api/placeholder/100/150"
//                               }
//                               alt={book.title}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="ml-3 flex-1">
//                             <h4 className="font-medium text-white group-hover:text-purple-300 line-clamp-1">
//                               {book.title}
//                             </h4>
//                             <p className="text-zinc-400 text-sm">
//                               {book.author}
//                             </p>
//                             <div className="mt-1 flex">
//                               {book.genre && book.genre[0] && (
//                                 <span className="text-xs px-2 py-0.5 bg-purple-900/30 text-purple-300 rounded-full">
//                                   {book.genre[0]}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render books list page
//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Books Header with Gradient */}
//       <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-zinc-900 py-16 relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
//         <div className="container mx-auto px-4 relative z-10">
//           <h1 className="text-4xl font-bold text-center mb-2 text-white">
//             {genre ? `${genre} Books` : "Explore Our Library"}
//           </h1>
//           <p className="text-center text-purple-100 text-lg mb-8">
//             {genre
//               ? `Browse our collection of ${genre.toLowerCase()} books`
//               : "Discover thousands of books across multiple genres"}
//           </p>

//           {/* Search and Filter Bar */}
//           <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 border border-zinc-800 shadow-lg">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="relative flex-grow">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Search size={18} className="text-zinc-400" />
//                 </div>
//                 <Input
//                   type="text"
//                   placeholder="Search by title, author, genre..."
//                   className="w-full pl-12 pr-4 py-6 rounded-xl bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 {searchQuery && (
//                   <button
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setSearchQuery("")}
//                   >
//                     <X size={16} className="text-zinc-400 hover:text-white" />
//                   </button>
//                 )}
//               </div>

//               {/* Filter Button for Mobile */}
//               {isMobileView && (
//                 <Sheet>
//                   <SheetTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="flex items-center justify-center gap-2 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 py-6"
//                     >
//                       <Filter size={18} />
//                       Filters
//                       {activeFiltersCount > 0 && (
//                         <Badge
//                           variant="secondary"
//                           className="bg-purple-600 text-white ml-1"
//                         >
//                           {activeFiltersCount}
//                         </Badge>
//                       )}
//                     </Button>
//                   </SheetTrigger>
//                   <SheetContent
//                     side="right"
//                     className="w-full sm:w-96 bg-zinc-900 border-zinc-800 text-white"
//                   >
//                     <SheetHeader>
//                       <SheetTitle className="text-white">Filters</SheetTitle>
//                     </SheetHeader>
//                     <div className="py-4">
//                       {/* Mobile Filter Content */}
//                       <div className="space-y-6">
//                         {/* Genre Filter */}
//                         <div>
//                           <h3 className="text-sm font-medium text-zinc-300 mb-3">
//                             Genres
//                           </h3>
//                           <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
//                             {allGenres.map((genre) => (
//                               <div
//                                 key={genre}
//                                 className="flex items-center space-x-2"
//                               >
//                                 <Checkbox
//                                   id={`genre-${genre}`}
//                                   checked={selectedGenres.includes(genre)}
//                                   onCheckedChange={() => toggleGenre(genre)}
//                                   className="border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
//                                 />
//                                 <label
//                                   htmlFor={`genre-${genre}`}
//                                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                                 >
//                                   {genre}
//                                 </label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Availability Filter */}
//                         <div>
//                           <h3 className="text-sm font-medium text-zinc-300 mb-3">
//                             Availability
//                           </h3>
//                           <div className="flex items-center space-x-2">
//                             <Switch
//                               id="available-filter"
//                               checked={selectedAvailability === "available"}
//                               onCheckedChange={(checked) =>
//                                 setSelectedAvailability(
//                                   checked ? "available" : "all"
//                                 )
//                               }
//                               className="data-[state=checked]:bg-purple-600"
//                             />
//                             <Label htmlFor="available-filter">
//                               Available books only
//                             </Label>
//                           </div>
//                         </div>

//                         {/* Year Range Filter */}
//                         <div>
//                           <div className="flex justify-between mb-2">
//                             <h3 className="text-sm font-medium text-zinc-300">
//                               Publication Year
//                             </h3>
//                             <span className="text-sm text-zinc-400">
//                               {yearRange[0]} - {yearRange[1]}
//                             </span>
//                           </div>
//                           <Slider
//                             value={yearRange}
//                             min={1900}
//                             max={new Date().getFullYear()}
//                             step={1}
//                             onValueChange={(value) =>
//                               setYearRange(value as [number, number])
//                             }
//                             className="my-6"
//                           />
//                         </div>

//                         {/* Reset Filters Button */}
//                         <Button
//                           variant="outline"
//                           className="w-full mt-4 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
//                           onClick={resetFilters}
//                         >
//                           Reset Filters
//                         </Button>
//                       </div>
//                     </div>
//                   </SheetContent>
//                 </Sheet>
//               )}

//               {/* Sort Dropdown - Always visible */}
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-full md:w-48 bg-zinc-800 border-zinc-700 text-white focus:ring-purple-500">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
//                   <SelectItem value="relevance">Relevance</SelectItem>
//                   <SelectItem value="title_asc">Title (A-Z)</SelectItem>
//                   <SelectItem value="title_desc">Title (Z-A)</SelectItem>
//                   <SelectItem value="newest">Newest First</SelectItem>
//                   <SelectItem value="oldest">Oldest First</SelectItem>
//                   <SelectItem value="availability">Availability</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Filter Button for Desktop */}
//               {!isMobileView && (
//                 <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="flex items-center justify-center gap-2 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
//                     >
//                       <SlidersHorizontal size={18} />
//                       Filters
//                       {activeFiltersCount > 0 && (
//                         <Badge
//                           variant="secondary"
//                           className="bg-purple-600 text-white ml-1"
//                         >
//                           {activeFiltersCount}
//                         </Badge>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-96 p-6 bg-zinc-900 border-zinc-800 text-white">
//                     <div className="space-y-6">
//                       {/* Genre Filter */}
//                       <div>
//                         <h3 className="text-sm font-medium text-zinc-300 mb-3">
//                           Genres
//                         </h3>
//                         <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
//                           {allGenres.map((genre) => (
//                             <div
//                               key={genre}
//                               className="flex items-center space-x-2"
//                             >
//                               <Checkbox
//                                 id={`genre-${genre}`}
//                                 checked={selectedGenres.includes(genre)}
//                                 onCheckedChange={() => toggleGenre(genre)}
//                                 className="border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
//                               />
//                               <label
//                                 htmlFor={`genre-${genre}`}
//                                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                               >
//                                 {genre}
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Availability Filter */}
//                       <div>
//                         <h3 className="text-sm font-medium text-zinc-300 mb-3">
//                           Availability
//                         </h3>
//                         <div className="flex items-center space-x-2">
//                           <Switch
//                             id="available-filter"
//                             checked={selectedAvailability === "available"}
//                             onCheckedChange={(checked) =>
//                               setSelectedAvailability(
//                                 checked ? "available" : "all"
//                               )
//                             }
//                             className="data-[state=checked]:bg-purple-600"
//                           />
//                           <Label htmlFor="available-filter">
//                             Available books only
//                           </Label>
//                         </div>
//                       </div>

//                       {/* Year Range Filter */}
//                       <div>
//                         <div className="flex justify-between mb-2">
//                           <h3 className="text-sm font-medium text-zinc-300">
//                             Publication Year
//                           </h3>
//                           <span className="text-sm text-zinc-400">
//                             {yearRange[0]} - {yearRange[1]}
//                           </span>
//                         </div>
//                         <Slider
//                           value={yearRange}
//                           min={1900}
//                           max={new Date().getFullYear()}
//                           step={1}
//                           onValueChange={(value) =>
//                             setYearRange(value as [number, number])
//                           }
//                           className="my-6"
//                         />
//                       </div>

//                       {/* Reset Filters Button */}
//                       <Button
//                         variant="outline"
//                         className="w-full mt-4 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
//                         onClick={resetFilters}
//                       >
//                         Reset Filters
//                       </Button>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Active Filters Display */}
//         {activeFiltersCount > 0 && (
//           <div className="mb-6 flex flex-wrap gap-2 items-center">
//             <span className="text-zinc-400 text-sm">Active filters:</span>

//             {selectedGenres.map((genre) => (
//               <Badge
//                 key={genre}
//                 variant="outline"
//                 className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
//               >
//                 {genre}
//                 <button
//                   onClick={() => toggleGenre(genre)}
//                   className="ml-1 hover:text-white"
//                 >
//                   <X size={14} />
//                 </button>
//               </Badge>
//             ))}

//             {selectedAvailability === "available" && (
//               <Badge
//                 variant="outline"
//                 className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
//               >
//                 Available Only
//                 <button
//                   onClick={() => setSelectedAvailability("all")}
//                   className="ml-1 hover:text-white"
//                 >
//                   <X size={14} />
//                 </button>
//               </Badge>
//             )}

//             {(yearRange[0] !== 1900 ||
//               yearRange[1] !== new Date().getFullYear()) && (
//               <Badge
//                 variant="outline"
//                 className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
//               >
//                 {yearRange[0]} - {yearRange[1]}
//                 <button
//                   onClick={() => setYearRange([1900, new Date().getFullYear()])}
//                   className="ml-1 hover:text-white"
//                 >
//                   <X size={14} />
//                 </button>
//               </Badge>
//             )}

//             {searchQuery && (
//               <Badge
//                 variant="outline"
//                 className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
//               >
//                 "{searchQuery}"
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="ml-1 hover:text-white"
//                 >
//                   <X size={14} />
//                 </button>
//               </Badge>
//             )}

//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-zinc-400 hover:text-white hover:bg-transparent"
//               onClick={resetFilters}
//             >
//               Clear all
//             </Button>
//           </div>
//         )}

//         {/* Results Count */}
//         <div className="mb-6 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-white">
//             {filteredBooks.length}{" "}
//             {filteredBooks.length === 1 ? "book" : "books"} found
//           </h2>
//         </div>

//         {/* Books Grid */}
//         {loading ? (
//           <div className="py-12 text-center">
//             <div className="w-12 h-12 border-4 border-zinc-600 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
//             <p className="mt-4 text-zinc-400">Loading books...</p>
//           </div>
//         ) : error && filteredBooks.length === 0 ? (
//           <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg">
//             {error}
//           </div>
//         ) : filteredBooks.length === 0 ? (
//           <div className="py-16 text-center backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
//             <BookOpen size={48} className="mx-auto text-zinc-700 mb-4" />
//             <h3 className="text-xl font-bold text-zinc-300 mb-2">
//               No books found
//             </h3>
//             <p className="text-zinc-500 mb-6">
//               We couldn't find any books matching your criteria
//             </p>
//             <Button
//               variant="outline"
//               onClick={resetFilters}
//               className="border-purple-700 text-purple-400 hover:bg-purple-900/20"
//             >
//               Reset Filters
//             </Button>
//           </div>
//         ) : (
//           <>
//             {/* Enhanced Book Cards Grid with Improved Dimensions */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
//               {filteredBooks.map((book) => (
//                 <div
//                   key={book._id}
//                   className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-lg overflow-hidden hover:border-purple-600/30 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300 group flex flex-col"
//                 >
//                   <Link to={`/books/${book._id}`} className="block flex-1">
//                     <div className="aspect-[3/4] overflow-hidden relative">
//                       <img
//                         src={book.coverImage || "/api/placeholder/300/400"}
//                         alt={book.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                       {book.availableCopies === 0 && (
//                         <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1">
//                           Not Available
//                         </div>
//                       )}
//                     </div>
//                     <div className="p-3">
//                       <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors duration-300 mb-1 line-clamp-1 text-sm">
//                         {book.title}
//                       </h3>
//                       <p className="text-zinc-400 text-xs mb-2">
//                         by {book.author}
//                       </p>

//                       {/* Genres */}
//                       <div className="flex flex-wrap gap-1 mb-2">
//                         {book.genre?.slice(0, 2).map((g) => (
//                           <span
//                             key={g}
//                             className="text-xs px-1.5 py-0.5 bg-purple-900/30 text-purple-300 rounded-full text-[10px]"
//                           >
//                             {g}
//                           </span>
//                         ))}
//                         {(book.genre?.length || 0) > 2 && (
//                           <span className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded-full text-[10px]">
//                             +{(book.genre?.length || 0) - 2}
//                           </span>
//                         )}
//                       </div>

//                       {/* Book Details */}
//                       <div className="flex justify-between items-center text-[10px] text-zinc-500">
//                         <div>
//                           {book.publishedDate && (
//                             <span>
//                               {new Date(book.publishedDate).getFullYear()}
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center">
//                           <BookMarked size={10} className="mr-1" />
//                           <span>
//                             {book.availableCopies}/{book.totalCopies}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>

//                   {/* Borrow Button */}
//                   <div className="p-3 pt-0">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-full border-zinc-700 hover:bg-purple-900/20 hover:text-purple-300 text-xs py-1"
//                       disabled={
//                         !book.availableCopies || book.availableCopies <= 0
//                       }
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleBorrowBook(book._id);
//                       }}
//                     >
//                       {book.availableCopies && book.availableCopies > 0
//                         ? "Borrow"
//                         : "Unavailable"}
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookPage;

// BookPage.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { sampleBooks } from "@/lib/sampleBook";
import { toast } from "sonner";
import BookDetails from "@/components/books/BookDetails";
import BookList from "@/components/books/BookLists";


interface Book {
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
}

const BookPage = () => {
  const params = useParams<{ id?: string; genre?: string }>();
  console.log(params,"params")
  let id: string | null = null;
  let genre: string = "";

  const potentialId = params.genre;
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(potentialId || '');

  if (potentialId && isMongoId) {
    id = potentialId;
  } else if (params.id) {
    id = params.id;
  }

  if (!isMongoId && params.genre) {
    genre = params.genre.charAt(0).toUpperCase() + params.genre.slice(1);
  }

  console.log("Extracted ID:", id);
  console.log("Extracted Genre:", genre);
  // const id = params.id ? params.id : null; // Use id from params if available
  // const genre = params.genre ? params.genre.charAt(0).toUpperCase() + params.genre.slice(1) : "";

  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(genre ? [genre] : []);
  const [selectedAvailability, setSelectedAvailability] = useState<"all" | "available">("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  useEffect(() => {
    const fetchBooks = async () => {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const endpoint = id 
          ? `${baseURL}/api/books/${id}`  // Use ${baseURL} instead of baseURL
          : `${baseURL}/api/books`; // Use ${baseURL} instead of baseURL
          
        const { data } = await axios.get(endpoint);
        setBooks(data.length > 0 ? data : sampleBooks);
  
        const genreSet = new Set<string>();
        data.forEach((book: Book) => book.genre?.forEach((g) => genreSet.add(g)));
        setAllGenres(Array.from(genreSet));
  
        setLoading(false);
      } catch (error: any) {
        setError(error.response?.data?.message || error.message);
        setBooks(sampleBooks);
        const genreSet = new Set<string>();
        sampleBooks.forEach((book) => book.genre?.forEach((g) => genreSet.add(g)));
        setAllGenres(Array.from(genreSet));
        setLoading(false);
      }
    };
    fetchBooks();
  }, [id]);

  useEffect(() => {
    if (genre) {
      const filteredByGenre = books.filter((book) => book.genre?.includes(genre));
      setFilteredBooks(filteredByGenre);
    } 
     else {
      setFilteredBooks(books); // Default to all books if no genre or id
    }
  }, [genre,books]);
  

  useEffect(() => {
    let filtered = [...books];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.genre?.some((g) => g.toLowerCase().includes(query))
      );
    }
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((book) =>
        book.genre?.some((g) => selectedGenres.includes(g))
      );
    }
    if (selectedAvailability === "available") {
      filtered = filtered.filter(
        (book) => book.availableCopies && book.availableCopies > 0
      );
    }
    filtered = filtered.filter((book) => {
      if (!book.publishedDate) return true;
      const year = new Date(book.publishedDate).getFullYear();
      return year >= yearRange[0] && year <= yearRange[1];
    });

    switch (sortBy) {
      case "title_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        filtered.sort((a, b) => (b.publishedDate && a.publishedDate ? new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime() : 0));
        break;
      case "oldest":
        filtered.sort((a, b) => (a.publishedDate && b.publishedDate ? new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime() : 0));
        break;
      case "availability":
        filtered.sort((a, b) => (b.availableCopies || 0) - (a.availableCopies || 0));
        break;
    }

    setFilteredBooks(filtered);

    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedGenres.length > 0) count++;
    if (selectedAvailability === "available") count++;
    if (yearRange[0] !== 1900 || yearRange[1] !== new Date().getFullYear()) count++;
    setActiveFiltersCount(count);
  }, [books, searchQuery, selectedGenres, selectedAvailability, sortBy, yearRange]);


  // useEffect(() => {
  //   let filtered = [...books];
  
  //   // If there's an id in the params, filter by that specific book ID
  //   if (id) {
  //     const foundBook = books.find((book) => book._id === id);
  //     console.log("Found Book:", foundBook,id); // Debugging line
  //     if (foundBook) {
  //       setFilteredBooks([foundBook]); // Set filteredBooks to just this book
  //     } else {
  //       setFilteredBooks([]); // No book found with this ID
  //     }
  //     return; // Exit early since we already set filteredBooks
  //   }
  
  //   // If there's no id in the params, continue filtering by genre, availability, etc.
  //   if (searchQuery.trim()) {
  //     const query = searchQuery.toLowerCase();
  //     filtered = filtered.filter(
  //       (book) =>
  //         book.title.toLowerCase().includes(query) ||
  //         book.author.toLowerCase().includes(query) ||
  //         book.description.toLowerCase().includes(query) ||
  //         book.genre?.some((g) => g.toLowerCase().includes(query))
  //     );
  //   }
  //   if (selectedGenres.length > 0) {
  //     filtered = filtered.filter((book) =>
  //       book.genre?.some((g) => selectedGenres.includes(g))
  //     );
  //   }
  //   if (selectedAvailability === "available") {
  //     filtered = filtered.filter(
  //       (book) => book.availableCopies && book.availableCopies > 0
  //     );
  //   }
  //   filtered = filtered.filter((book) => {
  //     if (!book.publishedDate) return true;
  //     const year = new Date(book.publishedDate).getFullYear();
  //     return year >= yearRange[0] && year <= yearRange[1];
  //   });
  
  //   // Sort the books according to the selected option
  //   switch (sortBy) {
  //     case "title_asc":
  //       filtered.sort((a, b) => a.title.localeCompare(b.title));
  //       break;
  //     case "title_desc":
  //       filtered.sort((a, b) => b.title.localeCompare(a.title));
  //       break;
  //     case "newest":
  //       filtered.sort((a, b) => (b.publishedDate && a.publishedDate ? new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime() : 0));
  //       break;
  //     case "oldest":
  //       filtered.sort((a, b) => (a.publishedDate && b.publishedDate ? new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime() : 0));
  //       break;
  //     case "availability":
  //       filtered.sort((a, b) => (b.availableCopies || 0) - (a.availableCopies || 0));
  //       break;
  //   }
  
  //   setFilteredBooks(filtered);
  
  //   // Update active filters count
  //   let count = 0;
  //   if (searchQuery.trim()) count++;
  //   if (selectedGenres.length > 0) count++;
  //   if (selectedAvailability === "available") count++;
  //   if (yearRange[0] !== 1900 || yearRange[1] !== new Date().getFullYear()) count++;
  //   setActiveFiltersCount(count);
  
  // }, [id, books, searchQuery, selectedGenres, selectedAvailability, sortBy, yearRange]);
  
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedAvailability("all");
    setYearRange([1900, new Date().getFullYear()]);
    setSortBy("relevance");
  };

  const handleBorrowBook = async (bookId: string) => {
    try {
      const updatedBooks = books.map((book) => {
        if (book._id === bookId && book.availableCopies && book.availableCopies > 0) {
          return { ...book, availableCopies: book.availableCopies - 1 };
        }
        return book;
      });
      setBooks(updatedBooks);
      if (currentBook && currentBook._id === bookId && currentBook.availableCopies && currentBook.availableCopies > 0) {
        setCurrentBook({ ...currentBook, availableCopies: currentBook.availableCopies - 1 });
      }
      toast.success("Book borrowed successfully!", { description: "You can pick up your book at the library counter." });
    } catch (error: any) {
      toast.error("Failed to borrow book", { description: error.response?.data?.message || "Something went wrong" });
    }
  };

  if (id && currentBook) {
    return <BookDetails book={currentBook} books={books} handleBorrowBook={handleBorrowBook} />;
  }
console.log("Filtered Books:", filteredBooks); // Debugging line
    
  return (
    <BookList
      books={filteredBooks}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedGenres={selectedGenres}
      toggleGenre={toggleGenre}
      selectedAvailability={selectedAvailability}
      setSelectedAvailability={setSelectedAvailability}
      yearRange={yearRange}
      setYearRange={setYearRange}
      sortBy={sortBy}
      setSortBy={setSortBy}
      resetFilters={resetFilters}
      allGenres={allGenres}
      activeFiltersCount={activeFiltersCount}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      loading={loading}
      error={error}
      handleBorrowBook={handleBorrowBook}
      genre={genre}
    />
  );
};

export default BookPage;
