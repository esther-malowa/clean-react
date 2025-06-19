const UpcomingCourses = () => {
  const courses = [
    {
      name: "3D Icon Design",
      date: "8 Sep, 2025",
      icon: "💜",
      status: "Scheduled",
    },
    {
      name: "UI Styleguide",
      date: "12 Nov, 2025",
      icon: "💠",
      status: "Pending",
    },
    {
      name: "UI Vector Design",
      date: "20 Sep, 2025",
      icon: "🔶",
      status: "Scheduled",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upcoming Courses</h2>
        <a href="#" className="text-blue-500 text-sm hover:underline">View All</a>
      </div>

      <div className="space-y-4">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border p-3 rounded-lg hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{course.icon}</span>
              <div>
                <p className="font-semibold text-sm">{course.name}</p>
                <p className="text-xs text-gray-500">{course.date}</p>
              </div>
            </div>
            <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {course.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingCourses;
