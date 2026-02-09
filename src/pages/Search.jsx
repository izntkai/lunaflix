import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchMovies } from "../services/tmdb"; 
import { Search as SearchIcon, Film, Calendar, Star, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// --- Sub-Component: Compact Search Card ---
const SearchCard = ({ movie }) => {
  return (
    <Link to={`/watch/${movie.id}`} className="group relative block w-full aspect-2/3 bg-[#202020] rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300">
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#1a1a1a]">
          <Film size={24} className="mb-2 opacity-50" />
          <span className="text-xs">No Image</span>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-white text-sm font-title font-semibold truncate mb-1">{movie.title}</h3>
        <div className="font-subtitle flex items-center justify-between text-[10px] text-gray-300">
          <span className="flex items-center gap-1 text-purple-500">
            <Star size={10} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
          </span>
          <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
        </div>
      </div>
    </Link>
  );
};

export default function Search() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query || "");

  // Update local state if URL param changes
  useEffect(() => {
    if (query) setSearchTerm(query);
  }, [query]);

  // Fetch results
  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      if (query) {
        searchMovies(query).then((data) => {
          setResults(data.results || []);
          setLoading(false);
        });
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 300); // Small debounce to prevent flickering

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-purple-600 selection:text-white pb-20">
      
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-white/5 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          
          <form onSubmit={handleSearch} className="flex-1 relative max-w-lg">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies..." 
              className="w-full bg-[#202020] font-title text-sm text-white pl-10 pr-4 py-2 rounded-lg border border-transparent focus:border-white/20 focus:bg-[#252525] outline-none transition-all placeholder:text-gray-600"
            />
          </form>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        {/* Results Header */}
        <div className="mb-6 flex items-baseline gap-2">
          <h1 className="text-xl font-title font-bold text-white">Results for</h1>
          <span className="text-xl font-bold text-purple-400 font-title italic">"{query}"</span>
          <span className="text-xs text-gray-500 ml-auto">{results.length} items found</span>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-purple-600 w-8 h-8 mb-4" />
            <p className="text-gray-500 text-sm">Searching the archives...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="w-16 h-16 text-gray-700 mb-4" />
            <h2 className="text-lg font-title font-semibold text-gray-300">No matches found</h2>
            <p className="text-gray-500 font-paragraph text-sm mt-1">Try checking your spelling or search for another title.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4"
          >
            {results.map((movie) => (
              <SearchCard key={movie.id} movie={movie} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}