import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, UserCircle2 } from "lucide-react";
import { NavLink } from "./NavLink";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/series", label: "TV Shows" },
  { to: "/genres", label: "Genres" },
  { to: "/trending", label: "Trending" },
  { to: "/my-list", label: "My List" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/${query.trim()}`);
    setQuery("");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        isScrolled ? "border-[#2A2A2F] bg-[#08080A]/90" : "border-transparent bg-transparent"
      } backdrop-blur`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1680px] items-center gap-4 px-4 md:px-8">
        <Link to="/" className="font-logo text-xl font-semibold tracking-tight text-[#F5F5F5]">
          LUNA<span className="text-[#A78BFA]">FLIX</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <form onSubmit={onSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies, shows, people"
              className="w-56 rounded-xl border border-[#2A2A2F] bg-[#111114] py-2 pl-9 pr-3 text-sm text-[#F5F5F5] outline-none transition focus:border-[#A78BFA]"
            />
          </form>
          <button className="rounded-xl border border-[#2A2A2F] bg-[#111114] p-2 text-[#A1A1AA] hover:text-[#C4B5FD]" aria-label="Notifications">
            <Bell size={16} />
          </button>
          <Link
            to="/profile"
            className="rounded-xl border border-[#2A2A2F] bg-[#111114] p-2 text-[#A1A1AA] hover:text-[#C4B5FD]"
            aria-label="Profile"
          >
            <UserCircle2 size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}
