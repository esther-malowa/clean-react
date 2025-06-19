const YourCourses = () => {
  const courses = [
    {
      title: "UI Vector Illustration",
      author: "Esther Howard",
      image: "/images/hero3.jpg",
      progress: 75,
      enrolled: 120,
      status: "Published",
    },
    {
      title: "Color Theory",
      author: "Cameron Williamson",
      image: "/images/hero2.jpg",
      progress: 60,
      enrolled: 85,
      status: "Draft",
    },
    {
      title: "Typography",
      author: "Guy Hawkins",
      image: "/images/hero1.jpg",
      progress: 90,
      enrolled: 145,
      status: "Published",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Your Courses</h2>
        <a href="#" className="text-blue-500 text-sm hover:underline">Manage All</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg overflow-hidden border hover:shadow transition"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">{course.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    course.status === "Published"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {course.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">By {course.author}</p>
              <p className="text-xs text-gray-500">{course.enrolled} Enrolled</p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <button className="mt-2 w-full text-center bg-blue-500 text-white text-sm py-1 rounded hover:bg-blue-600">
                Manage Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourCourses;
