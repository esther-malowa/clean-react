import React, { useState } from "react";

const popularBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-help",
    image: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    genre: "Finance",
    image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
  },
  {
    title: "The Power of Habit",
    author: "Charles Duhigg",
    genre: "Self-help",
    image: "https://images-na.ssl-images-amazon.com/images/I/51ejXdSceNL._SX329_BO1,204,203,200_.jpg",
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
    image: "https://m.media-amazon.com/images/I/41J87aD8FJL._SX331_BO1,204,203,200_.jpg",
  },
  {
    title: "Influence",
    author: "Robert Cialdini",
    genre: "Psychology",
    image: "https://m.media-amazon.com/images/I/51B6Y0JYPKL._SX331_BO1,204,203,200_.jpg",
  },
];

const genres = ["All", "Self-help", "Finance", "Strategy", "Productivity", "Business", "Psychology"];

const BookShowcase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  const filteredBooks = otherBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="p-6 bg-[#FBEFEA] min-h-screen font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold mb-8 text-center" style={{ color: "#0F6317" }}>
        Bookstore
      </h1>

      {/* Popular Books Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "#F18233" }}>
          Popular Books
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {popularBooks.map((book, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-md transition-shadow duration-300"
              style={{
                border: "2px solid #428338",
                backgroundColor: "#ffffff",
              }}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1" style={{ color: "#0F6317" }}>
                  {book.title}
                </h3>
                <p className="text-sm text-[#5EB74B] mb-1 italic">{book.author}</p>
                <p className="text-sm text-[#F18233] italic">{book.genre}</p>
                <button
                  className="mt-4 px-4 py-2 rounded text-white font-semibold"
                  style={{ backgroundColor: "#58B440" }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Books Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "#F18233" }}>
          Other Books
        </h2>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search books or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-[#428338] rounded shadow-inner w-1/2"
            style={{ backgroundColor: "#FBEFEA", color: "#0F6317" }}
          />
        </div>

        {/* Genre Filter */}
        <div className="flex justify-center mb-8">
          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-[#428338] rounded shadow-inner"
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentBooks.map((book, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-md transition-shadow duration-300"
              style={{
                border: "2px solid #0F6317",
                backgroundColor: "#ffffff",
              }}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1" style={{ color: "#0F6317" }}>
                  {book.title}
                </h3>
                <p className="text-sm text-[#5EB74B] mb-1 italic">{book.author}</p>
                <p className="text-sm text-[#F18233] italic">{book.genre}</p>
                <button
                  className="mt-4 px-4 py-2 rounded text-white font-semibold"
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
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 rounded font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#58B440" }}
            >
              Previous
            </button>
            <span
              className="px-5 py-2 rounded font-semibold"
              style={{ backgroundColor: "#58B440", color: "#FBEFEA" }}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2 rounded font-semibold text-white disabled:opacity-50"
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
