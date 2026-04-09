import { Link, useLocation } from "react-router-dom";

export function NavLink({ to, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative flex items-center gap-2 text-sm font-medium transition-colors duration-300 group
        ${isActive ? "text-purple-400" : "text-gray-300 hover:text-white"}`}
    >
      {Icon && <Icon size={16} className="mb-0.5" />}
      {label}
      {isActive && <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />}
    </Link>
  );
}
