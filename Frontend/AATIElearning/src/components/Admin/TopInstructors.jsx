const TopInstructors = () => {
  const instructors = [
    {
      name: "Esther Howard",
      image: "/images/book2.jpg",
      courses: 5,
      email: "esther@example.com",
    },
    {
      name: "Abigael Simmons",
      image: "/images/book1.jpg",
      courses: 26,
      email: "brooklyn@example.com",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Top Instructors</h2>
        <a href="#" className="text-blue-500 text-sm hover:underline">Manage All</a>
      </div>

      <div className="space-y-4">
        {instructors.map((inst, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border p-3 rounded-lg hover:shadow transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={inst.image}
                alt={`${inst.name}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm">{inst.name}</p>
                <p className="text-xs text-gray-500">{inst.email}</p>
                <p className="text-xs text-gray-400">{inst.courses} courses</p>
              </div>
            </div>
            <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopInstructors;
