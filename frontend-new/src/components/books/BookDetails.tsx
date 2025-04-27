// BookDetails.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCheck, Calendar, Hash, BookMarked, ArrowLeft } from "lucide-react";

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

interface BookDetailsProps {
  book: Book;
  books: Book[];
  handleBorrowBook: (bookId: string) => void;
}

const BookDetails = ({ book, books, handleBorrowBook }: BookDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-zinc-900 py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" className="mb-4 text-purple-200 hover:text-white hover:bg-purple-900/30" onClick={() => navigate("/books")}>
            <ArrowLeft size={16} className="mr-2" /> Back to Books
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden p-4">
              <div className="aspect-[2/3] overflow-hidden relative rounded-lg">
                <img src={book.coverImage || "/api/placeholder/300/450"} alt={book.title} className="w-full h-full object-cover" />
                {book.availableCopies === 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1">
                    Not Available
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!book.availableCopies || book.availableCopies <= 0}
                onClick={() => handleBorrowBook(book._id)}
              >
                <BookCheck size={18} className="mr-2" />
                {book.availableCopies && book.availableCopies > 0 ? "Borrow This Book" : "Currently Unavailable"}
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
              <h2 className="text-xl text-zinc-400 mb-4">by {book.author}</h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {book.genre?.map((g) => (
                  <Badge
                    key={g}
                    className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 cursor-pointer"
                    onClick={() => navigate(`/books?genre=${g}`)}
                  >
                    {g}
                  </Badge>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                <p className="text-zinc-300 leading-relaxed">{book.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <Calendar size={18} className="text-purple-400" />
                  <span>Published: {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Unknown"}</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-300">
                  <Hash size={18} className="text-purple-400" />
                  <span>ISBN: {book.ISBN || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2 text-zinc-300">
                  <BookMarked size={18} className="text-purple-400" />
                  <span>Availability: {book.availableCopies}/{book.totalCopies} copies</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-medium text-white mb-4">You might also like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {books
                  .filter((b) => b._id !== book._id && b.genre?.some((g) => book.genre?.includes(g)))
                  .slice(0, 3)
                  .map((b) => (
                    <div
                      key={b._id}
                      className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-lg overflow-hidden hover:border-purple-600/30 transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(`/books/${b._id}`)}
                    >
                      <div className="flex items-center p-3">
                        <div className="w-16 h-24 overflow-hidden rounded">
                          <img src={b.coverImage || "/api/placeholder/100/150"} alt={b.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-white group-hover:text-purple-300 line-clamp-1">{b.title}</h4>
                          <p className="text-zinc-400 text-sm">{b.author}</p>
                          <div className="mt-1 flex">
                            {b.genre && b.genre[0] && (
                              <span className="text-xs px-2 py-0.5 bg-purple-900/30 text-purple-300 rounded-full">
                                {b.genre[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

// Next: BookList.tsx...
