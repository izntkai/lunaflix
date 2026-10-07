import { Link, useLocation } from "react-router-dom";

export function NavLink({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`rounded-lg px-3 py-2 text-sm transition ${
        isActive
          ? "bg-[#A78BFA]/20 text-[#C4B5FD]"
          : "text-[#A1A1AA] hover:bg-[#18181C] hover:text-[#F5F5F5]"
      }`}
    >
      {label}
    </Link>
  );
}
