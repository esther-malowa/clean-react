

import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (book) => {
    // Use book_id instead of id
    if (!wishlist.find((item) => item.book_id === book.book_id)) {
      setWishlist([...wishlist, book]);
    }
  };

  const removeFromWishlist = (bookId) => {
    setWishlist(wishlist.filter((book) => book.book_id !== bookId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
