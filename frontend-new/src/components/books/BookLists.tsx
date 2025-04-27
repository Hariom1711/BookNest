import { Link } from "react-router-dom";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  X,
  SlidersHorizontal,
  Filter,
  BookOpen,
  BookMarked,
} from "lucide-react";

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

interface BookListProps {
  books: Book[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
  selectedAvailability: "all" | "available";
  setSelectedAvailability: (value: "all" | "available") => void;
  yearRange: [number, number];
  setYearRange: (value: [number, number]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  resetFilters: () => void;
  allGenres: string[];
  activeFiltersCount: number;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  loading: boolean;
  error: string | null;
  handleBorrowBook: (bookId: string) => void;
  genre?: string;
}

const BookList = ({
  books,
  searchQuery,
  setSearchQuery,
  selectedGenres,
  toggleGenre,
  selectedAvailability,
  setSelectedAvailability,
  yearRange,
  setYearRange,
  sortBy,
  setSortBy,
  resetFilters,
  allGenres,
  activeFiltersCount,
  isFilterOpen,
  setIsFilterOpen,
  loading,
  error,
  handleBorrowBook,
  genre,
}: BookListProps) => {
  const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;


  console.log("Books:", books);
  // console.log("Search Query:", searchQuery);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">
            {genre ? `${genre} Books` : "Explore Our Library"}
          </h1>
          <p className="text-center text-purple-100 text-lg mb-8">
            {genre
              ? `Browse our collection of ${genre.toLowerCase()} books`
              : "Discover thousands of books across multiple genres"}
          </p>

          {/* Search and Filters */}
          <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 border border-zinc-800 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-zinc-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search by title, author, genre..."
                  className="w-full pl-12 pr-4 py-6 rounded-xl bg-zinc-800 border-zinc-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={16} className="text-zinc-400 hover:text-white" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                </SelectContent>
              </Select>

              {/* Filters */}
              {isMobileView ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-white"
                    >
                      <Filter size={18} /> Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="bg-purple-600 text-white ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:w-96 bg-zinc-900 border-zinc-800 text-white"
                  >
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    {renderFilters()}
                  </SheetContent>
                </Sheet>
              ) : (
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-white"
                    >
                      <SlidersHorizontal size={18} /> Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="bg-purple-600 text-white ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-6 bg-zinc-900 border-zinc-800 text-white">
                    {renderFilters()}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>
      {activeFiltersCount > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-zinc-400 text-sm">Active filters:</span>

          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
            >
              {genre}
              <button
                onClick={() => toggleGenre(genre)}
                className="ml-1 hover:text-white"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}

          {selectedAvailability === "available" && (
            <Badge
              variant="outline"
              className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
            >
              Available Only
              <button
                onClick={() => setSelectedAvailability("all")}
                className="ml-1 hover:text-white"
              >
                <X size={14} />
              </button>
            </Badge>
          )}

          {(yearRange[0] !== 1900 ||
            yearRange[1] !== new Date().getFullYear()) && (
            <Badge
              variant="outline"
              className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
            >
              {yearRange[0]} - {yearRange[1]}
              <button
                onClick={() => setYearRange([1900, new Date().getFullYear()])}
                className="ml-1 hover:text-white"
              >
                <X size={14} />
              </button>
            </Badge>
          )}

          {searchQuery && (
            <Badge
              variant="outline"
              className="bg-zinc-800 text-purple-300 border-purple-800 flex items-center gap-1 py-1.5"
            >
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 hover:text-white"
              >
                <X size={14} />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-transparent"
            onClick={resetFilters}
          >
            Clear all
          </Button>
        </div>
      )}
      {/* Books Grid */}

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 border-4 border-zinc-600 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading books...</p>
        </div>
      ) : error && books.length === 0 ? (
        <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="py-16 text-center backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
          <BookOpen size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold text-zinc-300 mb-2">
            No books found
          </h3>
          <p className="text-zinc-500 mb-6">
            We couldn't find any books matching your criteria
          </p>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="border-purple-700 text-purple-400 hover:bg-purple-900/20"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Enhanced Book Cards Grid with Improved Dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {books.map((book) => (
              <div
                key={book._id}
                className="backdrop-blur-sm bg-zinc-900/60 border border-zinc-800/50 rounded-lg overflow-hidden hover:border-purple-600/30 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300 group flex flex-col"
              >
                <Link to={`/books/${book._id}`} className="block flex-1">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={book.coverImage || "/api/placeholder/300/400"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {book.availableCopies === 0 && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1">
                        Not Available
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors duration-300 mb-1 line-clamp-1 text-sm">
                      {book.title}
                    </h3>
                    <p className="text-zinc-400 text-xs mb-2">
                      by {book.author}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {book.genre?.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-xs px-1.5 py-0.5 bg-purple-900/30 text-purple-300 rounded-full text-[10px]"
                        >
                          {g}
                        </span>
                      ))}
                      {(book.genre?.length || 0) > 2 && (
                        <span className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded-full text-[10px]">
                          +{(book.genre?.length || 0) - 2}
                        </span>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <div>
                        {book.publishedDate && (
                          <span>
                            {new Date(book.publishedDate).getFullYear()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <BookMarked size={10} className="mr-1" />
                        <span>
                          {book.availableCopies}/{book.totalCopies}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Borrow Button */}
                <div className="p-3 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-zinc-700 hover:bg-purple-900/20 hover:text-purple-300 text-xs py-1"
                    disabled={
                      !book.availableCopies || book.availableCopies <= 0
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBorrowBook(book._id);
                    }}
                  >
                    {book.availableCopies && book.availableCopies > 0
                      ? "Borrow"
                      : "Unavailable"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  function renderFilters() {
    return (
      <div className="space-y-6 py-4">
        {/* Genre Filter */}
        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Genres</h3>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
            {allGenres.map((g) => (
              <div key={g} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${g}`}
                  checked={selectedGenres.includes(g)}
                  onCheckedChange={() => toggleGenre(g)}
                  className="border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <label
                  htmlFor={`genre-${g}`}
                  className="text-sm cursor-pointer"
                >
                  {g}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">
            Availability
          </h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="available-filter"
              checked={selectedAvailability === "available"}
              onCheckedChange={(checked) =>
                setSelectedAvailability(checked ? "available" : "all")
              }
              className="data-[state=checked]:bg-purple-600"
            />
            <Label htmlFor="available-filter">Available books only</Label>
          </div>
        </div>

        {/* Year Range Filter */}
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-300">
              Publication Year
            </h3>
            <span className="text-sm text-zinc-400">
              {yearRange[0]} - {yearRange[1]}
            </span>
          </div>
          <Slider
            value={yearRange}
            min={1900}
            max={new Date().getFullYear()}
            step={1}
            onValueChange={(value) => setYearRange(value as [number, number])}
            className="my-6"
          />
        </div>

        {/* Reset Filters */}
        <Button
          variant="outline"
          className="w-full mt-4 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    );
  }
};

export default BookList;
