import React from "react";
import { Link } from "react-router-dom";
import StarRating from "../StarRating"; 

const BookCard = ({ book }) => (
  <Link
    to={`/books/${book.book_id}`}
    className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition block"
  >
    <img
      src={book.image || book.cover}
      alt={book.title}
       className="h-64 w-full object-contain rounded-t-xl bg-white"
    />

    <div className="p-4">
      <h3 className="text-lg font-bold">{book.title}</h3>
      <p className="text-gray-500">by {book.author}</p>
      {book.rating && (
        <div className="mt-2">
          <StarRating rating={book.rating} />
        </div>
      )}
    </div>
  </Link>
);


export default BookCard;

