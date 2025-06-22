import { useEffect, useState, useCallback } from "react";
import logo from "../../assets/logo.jpg";
import BookCard from "./BookCard";
import useProtectPage from "../utils/ProtectPage";
import Backendconnection from "../services/services";

const otherBooks = [
  {
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    genre: "Strategy",
    image: "https://m.media-amazon.com/images/I/81rtt1b8wML.jpg",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Productivity",
    image: "https://m.media-amazon.com/images/I/81HMyqG4cbL.jpg",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    genre: "Business",
    image: "https://m.media-amazon.com/images/I/81-QB7nDh4L.jpg",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Psychology",
    image: "https://m.media-amazon.com/images/I/41J87aD8FJL._SX331_BO1,204,203,200_.jpg",
  },
  {
    title: "Influence",
    author: "Robert Cialdini",
    genre: "Psychology",
    image: "https://m.media-amazon.com/images/I/51B6Y0JYPKL._SX331_BO1,204,203,200_.jpg",
  },
];

const genres = [
  "All",
  "Self-help",
  "Finance",
  "Strategy",
  "Productivity",
  "Business",
  "Psychology",
];

const BookShowcase = () => {
  useProtectPage();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  const [popularBooks, setPopularBooks] = useState([]);
  const [popularBooksLoader, setPopularBooksLoader] = useState(false);
  const [popularError, setPopularError] = useState("");

  const filteredBooks = otherBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const getPopularBooks = useCallback(async () => {
    try {
      setPopularError('')
      setPopularBooks([]);
      setPopularBooksLoader(true);
      const books = await Backendconnection.getPopularBooks();
      console.log(books);
      if (Array.isArray(books)) {
        setPopularBooks(books);
      } else if (Array.isArray(books.books)) {
        setPopularBooks(books.books);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      setPopularError(error.message || "Something went wrong getting popular books.");
    } finally {
      setPopularBooksLoader(false);
    }
  }, []);

  useEffect(() => {
    getPopularBooks();
  }, [getPopularBooks]);

  return (
    <div className="p-4 bg-[#FBEFEA] min-h-screen font-sans text-gray-800">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={logo}
          alt="AATI Logo"
          className="h-14 w-14 rounded-full object-cover shadow-sm"
        />
      </div>

      {/* Popular Books */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#F18233" }}>
          Popular Books
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {popularBooksLoader && (
            <div className="flex justify-center items-center w-full">
              <div className="h-10 w-10 border-4 border-t-transparent border-green-600 rounded-full animate-spin"></div>
            </div>
          )}
          {popularError && <p className="text-red-600">{popularError}</p>}
          {!popularBooksLoader && !popularError && popularBooks.length === 0 && (
            <p className="text-red-600">There are no popular books at the moment.</p>
          )}
          {Array.isArray(popularBooks) && popularBooks.map((book) => (
            <BookCard key={book.book_id} book={book} />
          ))}
        </div>
      </div>

      {/* Other Books */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#F18233" }}>
          Other Books
        </h2>

        {/* Search */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search books or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-1.5 border border-[#428338] rounded shadow-inner w-1/2 text-sm"
            style={{ backgroundColor: "#FBEFEA", color: "#0F6317" }}
          />
        </div>

        {/* Genre Filter */}
        <div className="flex justify-center mb-6">
          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentPage(1);
            }}
            className="p-1.5 border border-[#428338] rounded shadow-inner text-sm"
            style={{ backgroundColor: "#FBEFEA", color: "#0F6317" }}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre} style={{ color: "#0F6317" }}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Book Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentBooks.map((book, index) => (
            <div
              key={index}
              className="rounded-md overflow-hidden shadow-sm transition-shadow duration-300"
              style={{ border: "1.5px solid #0F6317", backgroundColor: "#ffffff" }}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="text-base font-semibold mb-1" style={{ color: "#0F6317" }}>
                  {book.title}
                </h3>
                <p className="text-xs text-[#5EB74B] mb-1 italic">{book.author}</p>
                <p className="text-xs text-[#F18233] italic">{book.genre}</p>
                <button
                  className="mt-3 px-3 py-1 rounded text-white font-semibold text-sm"
                  style={{ backgroundColor: "#58B440" }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded font-semibold text-white disabled:opacity-50 text-sm"
              style={{ backgroundColor: "#58B440" }}
            >
              Previous
            </button>
            <span
              className="px-3 py-1.5 rounded font-semibold text-sm"
              style={{ backgroundColor: "#58B440", color: "#FBEFEA" }}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded font-semibold text-white disabled:opacity-50 text-sm"
              style={{ backgroundColor: "#58B440" }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookShowcase;
