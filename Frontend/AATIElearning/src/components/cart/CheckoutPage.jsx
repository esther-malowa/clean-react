import React, { useState } from "react";
import { useCart } from "./CartContext";
import Layout from "../HeaderFooter/Header";

const CheckoutPage = () => {
  const { cartItems } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [mpesaError, setMpesaError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePhone = (number) => /^\+2547\d{8}$/.test(number);

  const handleMpesaSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(mpesaNumber)) {
      setMpesaError("Enter a valid Safaricom number like +254712345678");
      return;
    }
    setMpesaError("");
    setProcessing(true);

    // Simulate processing
    setTimeout(() => {
      alert(`M-Pesa payment initiated for ${mpesaNumber}`);
      setProcessing(false);
      setSelectedPayment(null);
      setMpesaNumber("");
    }, 2000);
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace(/[^0-9.]/g, "")) || 0;
    return sum + price;
  }, 0);

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10 flex flex-col lg:flex-row gap-8">

          {/* LEFT SECTION - FORM + PAYMENT */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Shipping Information</h2>
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

            {/* PAYMENT OPTIONS */}
            <div className="mt-10">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Payment Method</h3>

              {!selectedPayment && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    onClick={() => setSelectedPayment("paypal")}
                    className="border p-4 rounded-lg w-full sm:w-1/2 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-sm transition"
                  >
                    <img src="/images/paypal.png" alt="PayPal" className="mx-auto mb-2 h-8 object-contain" />
                    <p className="text-gray-700 font-medium">Pay with PayPal</p>
                  </div>

                  <div
                    onClick={() => setSelectedPayment("mpesa")}
                    className="border p-4 rounded-lg w-full sm:w-1/2 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-sm transition"
                  >
                    <img src="/images/mpesa.png" alt="M-Pesa" className="mx-auto mb-2 h-8 object-contain" />
                    <p className="text-gray-700 font-medium">Pay with M-Pesa</p>
                  </div>
                </div>
              )}

              {/* M-PESA PAYMENT FORM */}
              {selectedPayment === "mpesa" && (
                <form onSubmit={handleMpesaSubmit} className="space-y-4 mt-4">
                  <label className="block font-medium text-gray-700">Enter M-Pesa Number:</label>
                  <input
                    type="tel"
                    placeholder="+2547XXXXXXXX"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    required
                  />
                  {mpesaError && <p className="text-red-500 text-sm">{mpesaError}</p>}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    {processing ? "Processing..." : "Pay Now"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className="text-sm text-gray-500 underline mt-2"
                  >
                    Back to Payment Options
                  </button>
                </form>
              )}

              {/* PAYPAL MOCK ACTION */}
              {selectedPayment === "paypal" && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-2">Redirecting to PayPal...</p>
                  <button
                    type="button"
                    onClick={() => alert("Redirected to PayPal (simulation)")}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  >
                    Continue with PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className="text-sm text-gray-500 underline mt-2"
                  >
                    Back to Payment Options
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - ORDER SUMMARY */}
          <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200 mb-4">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex justify-between py-2 text-gray-800 text-sm sm:text-base">
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
