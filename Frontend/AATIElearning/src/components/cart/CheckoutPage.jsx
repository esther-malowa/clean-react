import React, { useState } from "react";
import { useCart } from "./CartContext";
import Layout from "../Layout";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace(/[^0-9.]/g, "")) || 0;
    return sum + price;
  }, 0);

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 grid md:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Shipping Information</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                onChange={handleChange}
                required
              />
              <textarea
                name="address"
                placeholder="Shipping Address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                onChange={handleChange}
                required
              />
            </form>

            {/* Payment Options */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Payment Method</h3>
              <div className="flex gap-4">
                <div className="border p-4 rounded-lg w-1/2 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-sm transition">
                  <img src="/images/paypal.png" alt="PayPal" className="mx-auto mb-2 h-8 object-contain" />
                  <p className="text-gray-700 font-medium">Pay with PayPal</p>
                </div>
                <div className="border p-4 rounded-lg w-1/2 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-sm transition">
                  <img src="/images/mpesa.png" alt="M-Pesa" className="mx-auto mb-2 h-8 object-contain" />
                  <p className="text-gray-700 font-medium">Pay with M-Pesa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200 mb-4">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex justify-between py-2 text-gray-800">
                      <span>{item.title}</span>
                      <span>{item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
