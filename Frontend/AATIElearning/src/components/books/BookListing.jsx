import React, { useState } from "react";
import Layout from "../Layout";
import BookCard from "./BookCard";
import books from "./BookData";

const BookListing = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">📚 All Books</h2>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.book_id} book={book} />

            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No books found for "{searchQuery}"</p>
        )}
      </div>
    </Layout>
  );
};
export default BookListing;
