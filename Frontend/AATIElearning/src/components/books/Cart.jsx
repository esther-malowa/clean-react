// src/components/books/Cart.jsx
import React from "react";

const Cart = ({ cartItems = [], onRemove }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#F18233] mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 italic">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((book, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white shadow-md rounded-xl p-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-semibold text-[#2FBF3F]">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-xs text-gray-500 italic">{book.genre}</p>
                </div>
              </div>
              <button
                onClick={() => onRemove(book)}
                className="bg-[#58B440] text-white px-4 py-2 rounded hover:bg-green-700"
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

export default Cart;
