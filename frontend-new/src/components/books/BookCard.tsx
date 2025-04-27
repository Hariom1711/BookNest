// import { BookOpen, CheckCircle, XCircle } from 'lucide-react';
// import { Card, CardContent } from "@/components/ui/card";
// import { Link } from 'react-router-dom';
// import { Badge } from "@/components/ui/badge";

// interface BookProps {
//   book: {
//     _id: string;
//     title: string;
//     author: string;
//     coverImage?: string;
//     genre?: string[];
//     availableCopies?: number;
//     totalCopies?: number;
//   };
// }

// const BookCard = ({ book }: BookProps) => {
//   const isAvailable = book.availableCopies && book.availableCopies > 0;

//   return (
// <Link to={`/books/${book._id}`}>
//   <Card className="overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-purple-600 transition-all duration-200 rounded-lg w-44 sm:w-48">
//     <div className="w-full h-40 bg-zinc-800 relative">
//       {book.coverImage ? (
//         <img
//           src={book.coverImage}
//           alt={book.title}
//           className="object-cover w-full h-full"
//         />
//       ) : (
//         <div className="flex items-center justify-center h-full text-zinc-500">
//           <BookOpen size={36} />
//         </div>
//       )}
//     </div>
//     <CardContent className="p-3 space-y-1">
//       <h3 className="font-semibold text-white text-sm truncate">{book.title}</h3>
//       <p className="text-zinc-400 text-xs truncate">{book.author}</p>

//       <div className="flex flex-wrap gap-1 mt-1">
//         {book.genre?.slice(0, 2).map((g, i) => (
//           <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">
//             {g}
//           </Badge>
//         ))}
//       </div>

//       <div className="flex items-center gap-1 mt-1 text-xs">
//         {isAvailable ? (
//           <>
//             <CheckCircle size={14} className="text-green-500" />
//             <span className="text-green-500">Available</span>
//           </>
//         ) : (
//           <>
//             <XCircle size={14} className="text-red-500" />
//             <span className="text-red-500">Unavailable</span>
//           </>
//         )}
//       </div>
//     </CardContent>
//   </Card>
// </Link>

//   );
// };

// export default BookCard;



import { BookOpen, CheckCircle, XCircle, Bookmark } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

interface BookProps {
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage?: string;
    genre?: string[];
    availableCopies?: number;
    totalCopies?: number;
  };
}

const BookCard = ({ book }: BookProps) => {
  const isAvailable = book.availableCopies && book.availableCopies > 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/books/${book._id}`}>
      <Card 
        className="overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-purple-500 transition-all duration-300 rounded-xl shadow-lg shadow-black/20 hover:shadow-purple-900/20 group w-56"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Cover Image */}
          <div className="h-64 bg-gradient-to-b from-zinc-800 to-zinc-900 relative overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className={`object-cover w-full h-full transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <BookOpen size={48} className="opacity-50" />
              </div>
            )}
            
            {/* Availability Badge */}
            <div className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${isAvailable ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </div>
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Bookmark Icon */}
            <div className="absolute -right-6 top-2 group-hover:right-2 transition-all duration-300">
              <Bookmark className="text-purple-400" size={20} />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="font-bold text-white text-base leading-tight line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">{book.title}</h3>
            <p className="text-zinc-400 text-sm">{book.author}</p>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-1 mt-2">
              {book.genre?.slice(0, 2).map((g, i) => (
                <Badge key={i} className="bg-purple-900/40 hover:bg-purple-800 text-xs text-purple-200 rounded-md">
                  {g}
                </Badge>
              ))}
            </div>
            
            {/* Copy Status */}
            <div className="flex justify-between items-center mt-2 text-xs">
              <div className="flex items-center gap-1">
                {isAvailable ? (
                  <CheckCircle size={14} className="text-green-400" />
                ) : (
                  <XCircle size={14} className="text-red-400" />
                )}
                <span className={isAvailable ? "text-green-400" : "text-red-400"}>
                  {book.availableCopies || 0}/{book.totalCopies || 0} copies
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BookCard;