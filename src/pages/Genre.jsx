import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { discoverMovies, discoverTv } from "../services/tmdb";
import { Star, Play, Loader2, Filter } from "lucide-react";

export default function Genre() {
  const { type, id, name } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setItems([]);
    setPage(1);
    fetchData(1, true);
  }, [type, id]);

  const fetchData = async (pageNum, reset = false) => {
    if (pageNum > 1) setLoadingMore(true);
    else setLoading(true);
    
    try {
      const fetchFn = type === "movie" ? discoverMovies : discoverTv;
      const data = await fetchFn({ genre: id, page: pageNum });
      
      setItems(prev => reset ? data.results : [...prev, ...data.results]);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <div className="pb-20 mt-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-purple-500 rounded-full" />
          <div>
            <span className="text-purple-500 text-[10px] font-black uppercase tracking-widest">{type === 'movie' ? 'Movies' : 'Series'}</span>
            <h1 className="text-3xl md:text-5xl font-title font-black text-white uppercase tracking-tighter">
              {decodeURIComponent(name)}
            </h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-500 w-12 h-12" />
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/details/${type}/${item.id}`)}
                className="group relative aspect-[2/3] bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/5"
              >
                <img
                  src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <div className="absolute top-3 right-3 bg-purple-600 p-2 rounded-full shadow-lg">
                    <Play size={16} fill="white" className="text-white" />
                  </div>
                  <h3 className="text-white text-xs font-bold truncate">{item.title || item.name}</h3>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold">
                      <Star size={10} fill="currentColor" /> {(item.vote_average || 0).toFixed(1)}
                    </span>
                    <span>{(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-16">
            <button
              onClick={() => fetchData(page + 1)}
              disabled={loadingMore}
              className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-black uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loadingMore ? <Loader2 className="animate-spin w-5 h-5" /> : "Load More Content"}
            </button>
          </div>
        </>
      ) : (
        <div className="h-60 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
          <Filter className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-bold">No results found for this genre.</p>
        </div>
      )}
    </div>
  );
}
