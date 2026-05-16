import React from "react";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  return (
    <aside className="w-64 bg-white border-r p-5 hidden md:flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">Facegram</h1>
        <nav className="space-y-4">
          <NavItem icon={<Home size={20} />} label="Home" url="home" />
          <NavItem icon={<Search size={20} />} label="Search" url="search" />
          <NavItem icon={<PlusSquare size={20} />} label="Create" url="post" />
          <NavItem
            icon={<Heart size={20} />}
            label="Notifications"
            url="notifications"
          />
          <NavItem icon={<User size={20} />} label="Profile" url="profile" />
        </nav>
      </div>
      <div className="text-sm text-gray-500">© 2026 MyApp</div>
    </aside>
  );
}

function NavItem({ icon, label, url }) {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
      onClick={() => {
        navigate(`/${url}`);
      }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
