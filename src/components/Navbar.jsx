import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b 
          ${isScrolled 
            ? "bg-[#0f0f0f]/80 backdrop-blur-xl border-white/5 py-3 shadow-lg" 
            : "bg-linear-to-b from-black/80 to-transparent border-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between relative">
          
          {/* 1. LOGO (Left) */}
          <Link to="/" className="flex items-center gap-2 group z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-xl font-logo tracking-tight text-white block">
              LUNA<span className="text-purple-500">FLIX</span>
            </span>
          </Link>

          {/* 2. DESKTOP NAVIGATION (Absolutely Centered) */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavLink to="/" label="Home" />
            <NavLink to="/movies" label="Movies" />
            <NavLink to="/series" label="Series" />
          </nav>

          {/* 3. RIGHT ACTIONS (Search & Mobile Toggle) */}
          <div className="flex items-center gap-4 relative z-50">
            
            {/* Expandable Search Bar (DESKTOP ONLY) */}
            <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    placeholder="What to watch?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-white/10 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-black/50"
                    autoFocus
                  />
                )}
              </AnimatePresence>
              
              <button 
                type={isSearchOpen ? "submit" : "button"}
                onClick={(e) => {
                  if (!isSearchOpen) {
                    e.preventDefault();
                    setIsSearchOpen(true);
                  } else if (!query) {
                    setIsSearchOpen(false);
                  }
                }}
                className={`p-2 rounded-full transition-colors z-10 ${isSearchOpen ? 'absolute right-0 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
              >
                <Search size={20} />
              </button>
            </form>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

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