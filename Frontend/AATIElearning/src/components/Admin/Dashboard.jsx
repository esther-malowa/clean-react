import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ProfileCard from "./ProfileCard";
import TopInstructors from "./TopInstructors";
import UpcomingCourses from "./UpcomingCourses";
import YourCourses from "./YourCourses";
import MetricCard from "./MetricCard";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Topbar />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <ProfileCard />
            <UpcomingCourses />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
      <MetricCard title="Total Students" value="3,420" icon="🎓" />
      <MetricCard title="Total Instructors" value="120" icon="🧑" bg="bg-green-100" text="text-green-600" />
      <MetricCard title="Courses" value="210" icon="📘" bg="bg-yellow-100" text="text-yellow-600" />
      <MetricCard title="Revenue" value="$24,500" icon="💰" bg="bg-purple-100" text="text-purple-600" />
    </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner already exists here */}
            <div className="bg-[#5EB74B] text-gray-800 p-6 rounded-xl shadow border">
  <h2 className="text-xl font-semibold mb-1">Platform Overview</h2>
  <p className="text-sm text-gray-500 mb-4">You're managing 250+ active courses across 40 instructors.</p>

  <div className="grid grid-cols-2 gap-4 mb-4">
    <div className="text-center">
      <p className="text-2xl font-bold text-blue-600">250</p>
      <p className="text-xs text-gray-500">Active Courses</p>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-red-500">12</p>
      <p className="text-xs text-gray-500">Pending Approvals</p>
    </div>
  </div>

  <div className="flex gap-2">
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
      Manage Courses
    </button>
    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm">
      View Reports
    </button>
  </div>
</div>


            <YourCourses />
            <TopInstructors />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

