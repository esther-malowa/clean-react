import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../header_footer/Header";
import books from "./BookData"; 
import StarRating from "./StarRating";
import { useCart } from "../cart/CartContext";

const BookDetailsPage = () => {
  
  const { book_id } = useParams();
  const { addToCart } = useCart();

  const navigate = useNavigate();
  const book = books.find((b) => b.book_id === book_id);

  if (!book) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-500 font-semibold">
          Book not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
        <button
          onClick={() => navigate("/books")}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← Back to Book Listing
        </button>
        <img
  src={book.image || book.cover}
  alt={book.title}
  className="w-full h-64 object-contain rounded"
/>

        <h1 className="text-3xl font-bold mt-6">{book.title}</h1>
        <p className="text-lg text-gray-700 mt-2">Author: {book.author}</p>
        {book.rating && <StarRating rating={book.rating} />}
        <p className="mt-4 text-gray-600">{book.description}</p>
        <p className="mt-4 text-xl font-semibold text-blue-800">{book.price}</p>
        <button
  onClick={() => addToCart(book)}
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
>
  Add to Cart
</button>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Reviews:</h2>
          {book.reviews.length > 0 ? (
            book.reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-200 py-4">
    <StarRating rating={review.rating} />
    <p className="text-gray-700 mt-1">{review.text}</p>
  </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default BookDetailsPage;
