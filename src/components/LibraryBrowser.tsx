import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Grid,
  List as ListIcon,
  X,
} from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Book } from "../types";
import { MOCK_BOOKS } from "../data/mockBooks";
interface Props {
  onSelectBook: (book: Book) => void;
  readonly state: Readonly<{
    page: number;
    searchQuery: string;
    category: string;
  }>;
  onStateChange: (newState: any) => void;
}

const CATEGORIES = [
  "All",
  "Philosophy",
  "Metaphysics",
  "Healing",
  "Practice",
  "Spirituality",
  "Biography",
  "Poetry",
  "History",
  "Fiction",
  "Self-Help",
  "Science",
];
const ITEMS_PER_PAGE = 12;

export default function LibraryBrowser({
  onSelectBook,
  state,
  onStateChange,
}: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "library_books"), orderBy("title"));
        const snapshot = await getDocs(q);
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Book[];

        // If the backend is not available or the collection is empty,
        // fall back to mock data so the UI can be previewed.
        setBooks(booksData.length > 0 ? booksData : MOCK_BOOKS);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks(MOCK_BOOKS);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        book.tags.some((tag) =>
          tag.toLowerCase().includes(state.searchQuery.toLowerCase()),
        );

      const matchesCategory =
        state.category === "All" || book.category === state.category;

      return matchesSearch && matchesCategory;
    });
  }, [books, state.searchQuery, state.category]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (state.page - 1) * ITEMS_PER_PAGE,
    state.page * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStateChange({ ...state, searchQuery: e.target.value, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    onStateChange({ ...state, category, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    onStateChange({ ...state, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-text-main tracking-tight">
            Spiritual Library
          </h2>
          <p className="text-text-muted">
            Explore over {books.length} volumes of digitized wisdom.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              size={20}
            />
            <input
              type="text"
              placeholder="Search title, author, or tags..."
              value={state.searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-10 py-3 bg-white border border-border-light rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
            />
            {state.searchQuery && (
              <button
                onClick={() =>
                  onStateChange({ ...state, searchQuery: "", page: 1 })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white border border-border-light rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-gray-50"}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-gray-50"}`}
            >
              <ListIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center gap-2 px-3 py-2 text-text-muted shrink-0">
          <Filter size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">
            Categories:
          </span>
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              state.category === cat
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : "bg-white border-border-light text-text-muted hover:border-primary/50 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-text-muted">
        <p>
          Showing {paginatedBooks.length} of {filteredBooks.length} results
        </p>
        {state.searchQuery && (
          <p>
            Search results for "
            <span className="text-text-main font-bold">
              {state.searchQuery}
            </span>
            "
          </p>
        )}
      </div>

      {/* Books Display */}
      <AnimatePresence mode="wait">
        {paginatedBooks.length > 0 ? (
          <motion.div
            key={`${viewMode}-${state.page}-${state.searchQuery}-${state.category}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "space-y-4"
            }
          >
            {paginatedBooks.map((book) =>
              viewMode === "grid" ? (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -8 }}
                  className="bg-white border border-border-light rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all"
                  onClick={() => onSelectBook(book)}
                >
                  <div className="aspect-3/4 overflow-hidden relative">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {book.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl">
                        <BookOpen size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1">
                      {book.title}
                    </h4>
                    <p className="text-sm text-text-muted font-medium">
                      {book.author}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {book.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-text-muted bg-gray-100 px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={book.id}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-6 p-4 bg-white border border-border-light rounded-2xl group cursor-pointer shadow-sm hover:shadow-md transition-all"
                  onClick={() => onSelectBook(book)}
                >
                  <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-border-light">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {book.category}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted font-medium">
                      {book.author}
                    </p>
                    <p className="text-sm text-text-muted line-clamp-1 mt-2">
                      {book.description}
                    </p>
                  </div>
                  <div className="p-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={24} />
                  </div>
                </motion.div>
              ),
            )}
          </motion.div>
        ) : (
          <div className="text-center py-24 space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-text-muted">
              <Search size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-text-main">
                No books found
              </h3>
              <p className="text-text-muted">
                Try adjusting your search or category filters.
              </p>
            </div>
            <button
              onClick={() =>
                onStateChange({ page: 1, searchQuery: "", category: "All" })
              }
              className="text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-12">
          <button
            disabled={state.page === 1}
            onClick={() => handlePageChange(state.page - 1)}
            className="p-2 rounded-xl border border-border-light bg-white text-text-muted disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              // Show limited pages if too many
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= state.page - 1 && pageNum <= state.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      state.page === pageNum
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white border border-border-light text-text-muted hover:border-primary/50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === state.page - 2 ||
                pageNum === state.page + 2
              ) {
                return (
                  <span key={pageNum} className="text-text-muted">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            disabled={state.page === totalPages}
            onClick={() => handlePageChange(state.page + 1)}
            className="p-2 rounded-xl border border-border-light bg-white text-text-muted disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
