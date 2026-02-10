import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTvGenres, discoverTv } from "../services/tmdb";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import { Star, Play, Loader2, Tv } from "lucide-react";
import { motion } from "framer-motion";

export default function TvShows() {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  // Filters State
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [minRating, setMinRating] = useState(""); // Added state for Rating

  // Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        const genreData = await getTvGenres();
        setGenres(genreData.genres || []);
        await fetchShows(1, true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchShows(1, true);
    }
  }, [selectedGenre, selectedYear, selectedLanguage, minRating]); // Added minRating dependency

  const fetchShows = async (pageNum, reset = false) => {
    if (pageNum > 1) setLoadingMore(true);
    try {
      const data = await discoverTv({
        genre: selectedGenre,
        year: selectedYear,
        language: selectedLanguage,
        minRating: minRating, // Pass minRating to API
        page: pageNum,
      });
      
      setShows(prev => reset ? data.results : [...prev, ...data.results]);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchShows(page + 1);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 font-sans selection:bg-purple-500/30 pb-20">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-purple-500 rounded-full" />
          <h1 className="text-2xl md:text-3xl font-title font-bold text-white">Explore Series</h1>
        </div>

        {/* REUSABLE FILTERS COMPONENT */}
        <FilterBar 
          genres={genres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          minRating={minRating}       // Pass prop
          setMinRating={setMinRating} // Pass prop
        />

        {/* TV SHOWS GRID */}
        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
          </div>
        ) : shows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {shows.map((show) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/watch/tv/${show.id}`)}
                className="group relative aspect-[2/3] bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/5"
              >
                {/* Poster Image */}
                <img
                  src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                  alt={show.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <div className="absolute top-3 right-3 bg-purple-600 p-2 rounded-full shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Play size={16} fill="white" className="text-white" />
                  </div>
                  
                  <h3 className="text-white text-xs font-bold truncate">{show.name}</h3>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star size={10} fill="currentColor" /> {show.vote_average?.toFixed(1)}
                    </span>
                    <span>{show.first_air_date?.split("-")[0] || "N/A"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-60 flex flex-col items-center justify-center text-gray-500">
            <Tv size={48} className="mb-4 text-gray-700" />
            <p className="text-lg">No series found.</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && shows.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loadingMore ? <Loader2 className="animate-spin w-4 h-4" /> : "Load More Shows"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}