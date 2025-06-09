// src/components/books/BookShowcase.jsx
import React, { useState } from "react";

const popularBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-help",
    image:
      "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    genre: "Finance",
    image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
  },
];

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
    image: "https://m.media-amazon.com/images/I/71tbalAHYCL.jpg",
  },
  {
    title: "Grit",
    author: "Angela Duckworth",
    genre: "Self-help",
    image: "https://m.media-amazon.com/images/I/81rM3AlvMGL.jpg",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  // Filter otherBooks by search and genre
  const filteredBooks = otherBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Popular Books */}
      <h1 className="text-3xl font-bold text-center mb-6 text-[#F18233]">
        Popular Books
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-12">
        {popularBooks.map((book, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 border border-[#F18233]"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-[#F18233]">{book.title}</h2>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500 italic">{book.genre}</p>
              <button className="mt-3 bg-[#58B440] text-white px-3 py-1 rounded hover:bg-[#428338] transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Other Books */}
      <h1 className="text-3xl font-bold text-center mb-6 text-[#F18233]">
        Other Books
      </h1>

      {/* Search & Genre Filter */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded w-full sm:w-1/2 shadow-md"
        />
        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded shadow-md w-full sm:w-1/4"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentBooks.map((book, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 border border-[#F18233]"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-[#F18233]">{book.title}</h2>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500 italic">{book.genre}</p>
              <button className="mt-3 bg-[#58B440] text-white px-3 py-1 rounded hover:bg-[#428338] transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#58B440] text-white rounded disabled:opacity-50 hover:bg-[#428338] transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded font-semibold text-[#F18233]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#58B440] text-white rounded disabled:opacity-50 hover:bg-[#428338] transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookShowcase;
