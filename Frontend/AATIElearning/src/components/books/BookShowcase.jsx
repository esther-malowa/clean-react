import React, { useState } from "react";

const booksData = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    image:
      "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
  },
  {
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    image: "https://m.media-amazon.com/images/I/81rtt1b8wML.jpg",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    image: "https://m.media-amazon.com/images/I/81HMyqG4cbL.jpg",
  },
];

const BookShowcase = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = booksData.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Popular Books</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/2 shadow-md"
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookShowcase;
