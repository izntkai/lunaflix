import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" }, 
    { name: "Series", path: "/series" }, 
    { name: "Movies", path: "/movies" }
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-4 md:px-12 py-4 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? "bg-[#141414]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between relative h-10">
        
        {/* --- Logo (Left) --- */}
        <Link 
          to="/"
          className="text-lg md:text-2xl font-logo text-purple-400 tracking-wider cursor-pointer z-50 shrink-0 hover:text-purple-300 transition-colors"
        >
          LUNA<span className="text-white font-light">FLIX</span>
        </Link>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex gap-8 text-sm text-gray-300 font-title absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="hover:text-white cursor-pointer transition hover:scale-105 duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* --- Right Side Icons --- */}
        <div className="flex items-center gap-2 text-white z-50">
          <form onSubmit={handleSearch} className="flex items-center">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: isSearchOpen ? "240px" : "0px", 
                opacity: isSearchOpen ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden relative"
            >
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What to watch?"
                className="w-full bg-white/10 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:bg-black/50 focus:border-purple-500/50 transition-all placeholder:text-gray-400"
              />
              {isSearchOpen && (
                 <X 
                  size={14} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }} 
                 />
              )}
            </motion.div>

            <button 
              type="button" 
              onClick={() => {
                if(isSearchOpen && searchQuery.trim()) {
                  handleSearch({ preventDefault: () => {} });
                } else {
                  setIsSearchOpen(!isSearchOpen);
                }
              }}
              className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'text-purple-400' : 'hover:bg-white/10'}`}
            >
              <Search size={20} />
            </button>
          </form>
          
          <button 
            className="md:hidden text-white hover:text-gray-300 transition p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#141414] border-t border-white/10 shadow-2xl md:hidden overflow-hidden mt-4 rounded-xl"
          >
            <div className="flex flex-col items-center py-6 space-y-6">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className="text-gray-200 text-lg font-medium hover:text-purple-400 cursor-pointer transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;