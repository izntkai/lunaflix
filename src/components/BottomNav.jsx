import { Link, useLocation } from "react-router-dom";
import { House, Compass, Search, Bookmark, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: House },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/search/trending", label: "Search", icon: Search },
  { to: "/my-list", label: "My List", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#2A2A2F] bg-[#08080A]/95 px-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.45rem)] pt-2 backdrop-blur md:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to || (item.to === "/search/trending" && location.pathname.startsWith("/search/"));

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] transition ${
                  active ? "bg-[#A78BFA]/15 text-[#C4B5FD]" : "text-[#A1A1AA]"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
