import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";
import { usePlatform } from "../hooks/usePlatform";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { isNative } = usePlatform();

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/movies", label: "Movies" },
    { to: "/series", label: "Series" },
    { to: "/genres", label: "Genres" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  if (isNative) {
    return (
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5"
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-logo tracking-tighter text-white">
            LUNA<span className="text-purple-500 font-bold">FLIX</span>
          </span>
        </Link>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/5 rounded-full border border-white/10 text-gray-400"
        >
          <User size={20} />
        </motion.button>
      </motion.header>
    );
  }

  return (
    <>
      <motion.header 
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{
          y: 0,
          x: "-50%",
          opacity: 1,
          top: isScrolled ? 16 : 24,
          paddingTop: isScrolled ? 8 : 12,
          paddingBottom: isScrolled ? 8 : 12,
          paddingLeft: isScrolled ? 24 : 32,
          paddingRight: isScrolled ? 24 : 32,
          width: isScrolled ? "max-content" : "min(1200px, 92%)",
          backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.9)" : "rgba(255, 255, 255, 0.05)",
          borderColor: isScrolled ? "rgba(168, 85, 247, 0.4)" : "rgba(255, 255, 255, 0.1)",
          boxShadow: isScrolled ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(168, 85, 247, 0.2)" : "0 0 0 rgba(0,0,0,0)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
        className="fixed left-1/2 z-50 rounded-full border backdrop-blur-2xl flex items-center justify-between min-w-max"
      >
        <Link to="/" className="flex items-center group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>


          <motion.span
            layout
            animate={{
              opacity: isScrolled ? 0 : 1,
              width: isScrolled ? 0 : "auto",
              marginLeft: isScrolled ? 0 : 8
            }}
            className="text-lg font-logo tracking-tighter text-white block overflow-hidden whitespace-nowrap"
          >
            LUNA<span className="text-purple-500">FLIX</span>
          </motion.span>
        </Link>

        <LayoutGroup>
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 mx-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} label={item.label} />
            ))}
          </nav>
        </LayoutGroup>

        <div className="flex items-center gap-1">
          <form onSubmit={handleSearch} className="flex items-center">
            <AnimatePresence mode="popLayout">
              {isSearchOpen && (
                <motion.div
                  layout
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-white/10 border border-white/10 rounded-full py-2 px-4 text-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-32 md:w-48 ml-2"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              layout
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.9 }}
              type={isSearchOpen ? "submit" : "button"}
              onClick={(e) => {
                if (!isSearchOpen) {
                  e.preventDefault();
                  setIsSearchOpen(true);
                } else if (!query) {
                  setIsSearchOpen(false);
                }
              }}
              className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${isSearchOpen ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
            >
              <Search size={18} />
            </motion.button>
          </form>

          <motion.button
            layout
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-gray-400 hover:text-white rounded-full transition-colors flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </motion.header>

      {/* 4. MOBILE MENU OVERLAY */}
      <AnimatePresence>
        <MobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
        />
      </AnimatePresence>
    </>
  );
}