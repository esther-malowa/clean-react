import React from "react";

const BookCard = ({ book }) => {
  return (
    <div
      className="w-[150px] sm:w-[160px] md:w-[180px] rounded-lg shadow-sm border"
      style={{ borderColor: "#0F6317", backgroundColor: "#ffffff" }}
    >
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-36 object-contain p-2 bg-white"
      />
      <div className="p-2 text-center">
        <h3 className="text-sm font-semibold" style={{ color: "#0F6317" }}>
          {book.title}
        </h3>
        <p className="text-xs text-[#5EB74B] italic">{book.author}</p>
        <p className="text-xs text-[#F18233] italic">{book.genre}</p>
        <button
          className="mt-2 w-full py-1 rounded text-white text-xs font-medium"
          style={{ backgroundColor: "#58B440" }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;
