import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchMulti } from "../services/tmdb";
import { Search as SearchIcon, Film, Star, ArrowLeft, Loader2, Tv, X } from "lucide-react";
import { usePlatform } from "../hooks/usePlatform";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

// --- Sub-Component: Compact Search Card ---
const SearchCard = ({ item }) => {
  const { isNative } = usePlatform();
  // Determine properties based on media type (Movie vs TV)
  const isMovie = item.media_type === "movie" || item.title;
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const type = item.media_type || (item.title ? "movie" : "tv");

  const handleCardClick = async () => {
    if (isNative) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (e) {}
    }
  };

  return (
    <Link 
      to={`/details/${type}/${item.id}`} 
      onClick={handleCardClick}
      className="group relative block w-full aspect-[2/3] bg-[#202020] rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300"
    >
      {item.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w400${item.poster_path}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#1a1a1a]">
          {isMovie ? <Film size={24} className="mb-2 opacity-50" /> : <Tv size={24} className="mb-2 opacity-50" />}
          <span className="text-xs">No Image</span>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-white text-sm font-title font-semibold truncate mb-1">{title}</h3>
        <div className="font-subtitle flex items-center justify-between text-[10px] text-gray-300">
          <span className="flex items-center gap-1 text-purple-500">
            <Star size={10} fill="currentColor" /> {item.vote_average?.toFixed(1)}
          </span>
          <div className="flex items-center gap-2">
            <span className="uppercase border border-white/20 px-1 rounded text-[8px]">{type}</span>
            <span>{date?.split("-")[0] || "N/A"}</span>
          </div>
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
  const { isNative } = usePlatform();

  // Fetch results
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        setLoading(true);
        searchMulti(query).then((data) => {
          // Filter out people, keeping only movies and tv shows
          const filtered = (data.results || []).filter(item => item.media_type !== "person");
          setResults(filtered);
          setLoading(false);
        });
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 300); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const clearSearch = async () => {
    setSearchTerm("");
    if (isNative) {
      try { await Haptics.impact({ style: ImpactStyle.Light }); } catch(e) {}
    }
    navigate("/search");
  };

  return (
    <div className={isNative ? "pt-0 pb-10" : "pt-16"}>
      
      {/* --- Sticky Header --- */}
      <div className={`sticky ${isNative ? 'top-14 pt-4' : 'top-16'} z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5 pb-4 px-4 md:px-8`}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {!isNative && (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <form onSubmit={handleSearch} className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies & TV shows..." 
              className={`w-full bg-[#1a1a1a] font-title text-base text-white pl-12 pr-12 py-3.5 rounded-2xl border border-white/5 focus:border-purple-500/50 focus:bg-[#202020] outline-none transition-all placeholder:text-gray-600 shadow-inner ${isNative ? 'text-lg' : ''}`}
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-4">
        
        {/* Results Header */}
        {query && (
          <div className="mb-4 flex items-baseline gap-2">
            <h1 className="text-lg font-title font-medium text-gray-400">Results for</h1>
            <span className="text-lg font-bold text-white font-title italic">"{query}"</span>
            <span className="text-xs text-gray-600 ml-auto">{results.length} found</span>
          </div>
        )}

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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {results.map((item) => (
              <SearchCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}