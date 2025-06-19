const Topbar = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div>
        <h1 className="text-xl font-bold">Hello, Malowa 👋</h1>
        <p className="text-sm text-gray-500">Welcome to Dashboard!</p>
      </div>
      <div className="flex items-center gap-4">
        <input type="text" placeholder="Search..." className="border rounded px-4 py-1" />
        <button className="text-gray-600">&#128276;</button>
        <img src="/images/book1.jpg" className="w-8 h-8 rounded-full" alt="Book" />

      </div>
    </header>
  );
};

export default Topbar;
