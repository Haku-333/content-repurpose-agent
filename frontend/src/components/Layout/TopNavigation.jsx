import { Link, useLocation } from "react-router-dom";
import { Settings, User } from "lucide-react";

export function TopNavigation() {
  const location = useLocation();

  const navLinks = [
    { label: "Dashboard", path: "/" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <header className="h-16 flex items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-white flex items-center justify-center">
            <span className="text-[#0A0A0A] font-bold text-xs">r</span>
          </div>
          <span className="font-semibold text-white tracking-tight">reprop.io</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm transition-colors ${
                location.pathname === link.path
                  ? "text-white font-medium"
                  : "text-[#A0A0A0] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          to="/settings" 
          className="text-[#A0A0A0] hover:text-white transition-colors p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
        >
          <Settings className="w-5 h-5" />
        </Link>
        <Link 
          to="/settings"
          className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#111111] border border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-1 focus:ring-white"
        >
          <User className="w-4 h-4 text-[#A0A0A0]" />
        </Link>
      </div>
    </header>
  );
}
