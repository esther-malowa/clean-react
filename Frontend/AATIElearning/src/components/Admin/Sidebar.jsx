import { LayoutDashboard, Users, BookOpen, Settings, MessageCircle } from "lucide-react";

const Sidebar = () => (
  <aside className="bg-[#5EB74B] text-white w-64 min-h-screen p-4 space-y-6">
    <img src="/images/Logo.png" alt="Logo" className="w-10 h-10" />
    <h2 className="text-2xl font-bold">Admin Panel</h2>
    <nav className="space-y-4">
      <a href="#" className="flex items-center gap-2 hover:text-teal-400">
        <LayoutDashboard /> Dashboard
      </a>
      <a href="#" className="flex items-center gap-2 hover:text-teal-400">
        <Users /> Users
      </a>
      <a href="#" className="flex items-center gap-2 hover:text-teal-400">
        <BookOpen /> Courses
      </a>
      <a href="#" className="flex items-center gap-2 hover:text-teal-400">
        <Settings /> Settings
      </a>
      <a href="#" className="flex items-center gap-2 hover:text-teal-400">
        <MessageCircle /> Messages
      </a>
    </nav>
  </aside>
);

export default Sidebar;
