import React, { useState, useEffect } from 'react';

const ORDERS_PER_PAGE = 5;

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState(() => localStorage.getItem('userTheme') || 'light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userProfile');
    return savedUser
      ? JSON.parse(savedUser)
      : {
          firstName: 'Esther',
          lastName: 'Malowa',
          username: 'esther',
          email: 'esther@gmail.com',
          address: '2003street1.',
          city: 'Nairobi',
          age: 27,
          country: 'Kisumu',
          role: 'Data analyst',
          school: 'University of Computer Science',
          profileImage: 'https://randomuser.me/api/portraits/women/79.jpg',
        };
  });

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';
  }, [theme]);

  useEffect(() => {
    setLoading(true);
    try {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        const dummyOrders = [
          { id: 1, item: 'React Book', date: '2024-04-01' },
          { id: 2, item: 'Tailwind Guide', date: '2024-04-10' },
          { id: 3, item: 'Laptop', date: '2024-04-20' },
          { id: 4, item: 'Course Access', date: '2024-05-01' },
          { id: 5, item: 'Tablet', date: '2024-05-10' },
          { id: 6, item: 'Monitor', date: '2024-05-12' },
        ];
        localStorage.setItem('userOrders', JSON.stringify(dummyOrders));
        setOrders(dummyOrders);
      }
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profileImage: imageUrl });
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      localStorage.setItem('userProfile', JSON.stringify(user));
    }
    setIsEditing(!isEditing);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    localStorage.setItem('userTheme', selectedTheme);
  };

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-800 to-purple-600 text-white'}`}>
      <div className="relative h-72 bg-cover bg-center px-6 flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503342452485-86b7f54527dd')" }}>
        <div>
          <h1 className="text-4xl font-bold">Hello {user.firstName}</h1>
          <p className="mt-2 text-sm max-w-md">
            {isEditing ? 'Edit and save your information' : 'View your profile details'}.
          </p>
          <button onClick={toggleEdit} className="mt-4 bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-semibold">
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="relative -mt-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="md:col-span-2 bg-white text-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              {['account', 'orders', 'settings'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 rounded ${activeTab === tab ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          {activeTab === 'account' && (
            <>
              <div className="text-xs text-gray-500 mb-3">USER INFORMATION</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['username', 'email', 'firstName', 'lastName'].map((field) => (
                  <div key={field}>
                    <label className="text-sm capitalize">{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={user[field]}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 rounded"
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </div>

              <hr className="my-6" />
              <div className="text-xs text-gray-500 mb-3">CONTACT INFORMATION</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['address', 'city', 'country'].map((field) => (
                  <div key={field}>
                    <label className="text-sm capitalize">{field}</label>
                    <input
                      type="text"
                      name={field}
                      value={user[field]}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-gray-100 rounded"
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Order History</h2>
              {loading ? (
                <p className="text-gray-600 text-sm">Loading orders...</p>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <>
                  {paginatedOrders.map((order) => (
                    <div key={order.id} className="mb-3 p-3 border rounded shadow-sm bg-gray-50">
                      <p><strong>Item:</strong> {order.item}</p>
                      <p className="text-sm text-gray-500">Date: {order.date}</p>
                    </div>
                  ))}
                  <div className="mt-4 flex justify-between text-sm">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Next</button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="mt-2 text-sm">
              <div>
                <label className="block mb-1">Change Password (Demo)</label>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-2 bg-gray-100 rounded"
                  disabled={!isEditing}
                />
              </div>
              <div className="mt-4">
                <label className="block mb-1">Theme</label>
                <select
                  value={theme}
                  onChange={handleThemeChange}
                  className="w-full px-4 py-2 bg-gray-100 rounded"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Profile Summary */}
        <div className="bg-white text-gray-800 shadow rounded-lg p-6 text-center">
          <div className="relative w-32 h-32 mx-auto -mt-20">
            <img
              src={user.profileImage}
              alt="profile"
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <button className="bg-cyan-400 hover:bg-cyan-500 text-white py-1 px-4 rounded-full text-sm">Connect</button>
            <button className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-4 rounded-full text-sm">Message</button>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}, {user.age}</h3>
            <p className="text-sm">{user.city}, {user.country}</p>
            <p className="mt-2 text-sm font-medium">{user.role}</p>
            <p className="text-sm">{user.school}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
