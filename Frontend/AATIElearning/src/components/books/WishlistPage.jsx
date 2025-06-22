
 

import React from "react";
import { useWishlist } from "./WishlistContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-4">
          {wishlist.map((book) => (
            <div
              key={book.book_id}
              className="border p-4 rounded shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </div>
              <button
                onClick={() => removeFromWishlist(book.book_id)}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
