import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTrendingMovies, getPopularMovies } from "../services/tmdb";
import { Play, Info, ChevronRight, ChevronLeft, Star, Search, Calendar, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. Navbar Component (Fixed Centering + Better Search UI) ---
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

  // Focus input when opened
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

  const navLinks = ["Home", "Series", "Movies"];

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-4 md:px-12 py-4 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? "bg-[#141414]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between relative h-10">
        
        {/* --- Logo (Left) --- */}
        <div 
          className="text-2xl font-logo text-purple-400 tracking-wider cursor-pointer z-50 shrink-0"
          onClick={() => navigate("/")}
        >
          LUNA<span className="text-white font-light">FLIX</span>
        </div>

        {/* --- Desktop Menu (Absolutely Centered) --- */}
        {/* This stays centered regardless of left/right content width */}
        <div className="hidden md:flex gap-8 text-sm text-gray-300 font-title absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((item) => (
            <span key={item} className="hover:text-white cursor-pointer transition hover:scale-105 duration-200">
              {item}
            </span>
          ))}
        </div>

        {/* --- Right Side Icons (Search + Mobile Toggle) --- */}
        <div className="flex items-center gap-2 text-white z-50">
          
          {/* Enhanced Search Bar */}
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
              {/* Close/Clear Button inside input */}
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
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-white hover:text-gray-300 transition p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
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
                <span 
                  key={item} 
                  className="text-gray-200 text-lg font-medium hover:text-purple-400 cursor-pointer transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- 2. REDESIGNED HERO: Compact Cinematic Card ---
const Hero = ({ movie }) => {
  const navigate = useNavigate();
  if (!movie) return <div className="h-[60vh] w-full bg-[#1a1a1a] animate-pulse rounded-2xl mx-4 mt-24" />;

  return (
    <div className="pt-24 pb-6 px-4 md:px-8 max-w-450 mx-auto">
      <div className="relative h-[55vh] md:h-[65vh] w-full rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] group border border-white/5 bg-[#141414]">
        
        {/* Background Image with Slow Zoom */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0"
        >
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-90"
          />
        </motion.div>
        
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Content Container */}
        <div className="absolute bottom-0 top-0 left-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl space-y-5">
          
          {/* Metadata Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 text-xs font-semibold tracking-wide"
          >
            <span className="font-paragraph bg-purple-500 text-black px-2 py-0.5 rounded">
              FEATURED
            </span>
            <span className="font-paragraph flex items-center gap-1 text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
              <Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
            </span>
            <span className="font-paragraph text-gray-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
               <Calendar size={12} /> {movie.release_date?.split("-")[0]}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-title font-bold text-white leading-[1.1] drop-shadow-xl"
          >
            {movie.title || movie.name}
          </motion.h1>

          {/* Overview */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-paragraph text-gray-300 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed max-w-lg"
          >
            {movie.overview}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 pt-2"
          >
            <button
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="font-title flex items-center gap-2 bg-purple-500 text-black px-6 py-3 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-bold text-sm md:text-base shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Play size={20} fill="currentColor" /> Watch Now
            </button>
            <button
              onClick={() => navigate(`/info/${movie.id}`)}
              className="font-title flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-sm md:text-base"
            >
              <Info size={20} /> Details
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- 3. REDESIGNED MOVIE CARD: Compact & UI Rich ---
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative flex-none w-35 md:w-45aspect-2/3 cursor-pointer group"
      onClick={() => navigate(`/watch/${movie.id}`)}
    >
      <div className="w-full h-full rounded-xl overflow-hidden relative shadow-lg bg-[#202020] ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Compact Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          
          {/* Action Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg">
             <Play size={20} fill="white" className="text-white" />
          </div>

          {/* Text Info */}
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white text-xs md:text-sm font-title truncate mb-1">
              {movie.title || movie.name}
            </h3>
            
            <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-300 font-medium">
              <span className="flex items-center gap-1 text-purple-500">
                <Star size={10} fill="currentColor" /> 
                {movie.vote_average?.toFixed(1)}
              </span>
              <span>{movie.release_date?.split("-")[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 4. Interactive Row with Paddles ---
const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  const scroll = (offset) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 group/row relative px-6 md:px-12">
      <h2 className="text-purple-400 text-lg md:text-2xl font-title font-bold mb-4 flex items-center gap-2 hover:text-white cursor-pointer transition-colors w-fit">
        {title}
      </h2>

      <div className="relative">
        {/* Left Paddle */}
        <button 
          onClick={() => scroll(-800)}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-l-md"
        >
          <ChevronLeft className="text-white" size={32} />
        </button>

        {/* Scroll Container */}
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Paddle */}
        <button 
          onClick={() => scroll(800)}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-r-md"
        >
          <ChevronRight className="text-white" size={32} />
        </button>
      </div>
    </div>
  );
};

// --- 5. Skeleton Loader ---
const HomeSkeleton = () => (
  <div className="bg-[#141414] min-h-screen animate-pulse">
    <div className="h-[80vh] bg-gray-800 w-full" />
    <div className="p-12 space-y-12 -mt-32 relative z-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-48 bg-gray-800 rounded" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="h-50 w-37.5 bg-gray-800 rounded-md flex-none" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Page Component ---
export default function Home() {
  const [data, setData] = useState({ trending: [], popular: [], featured: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, popularRes] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
        ]);
        
        const trending = trendingRes.results || [];
        const popular = popularRes.results || [];
        const randomFeatured = trending.length > 0 
          ? trending[Math.floor(Math.random() * trending.length)] 
          : null;

        setData({ trending, popular, featured: randomFeatured });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchData();
  }, []);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden selection:bg-red-600 selection:text-white font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <Hero movie={data.featured} />

      {/* Content Stack */}
      <div className="relative z-10 -mt-1 md:-mt-1 bg-transparent pb-20">
        <MovieRow title="Trending Now" movies={data.trending} />
        <MovieRow title="Top Picks for You" movies={data.popular} />
        <MovieRow title="Action Thrillers" movies={[...data.popular].reverse()} />
        <MovieRow title="New Releases" movies={[...data.trending].reverse()} />
      </div>

      <footer className="py-12 text-center text-gray-600 text-sm bg-black/50">
        <p className="mb-2">Disclaimer: This website does not own, store, or host any movie player content. <br />All streaming players are embedded through third-party hosting services using their respective APIs.</p>
        <p>© 2026 Lunaflix</p>
      </footer>
    </div>
  );
}