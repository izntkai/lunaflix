import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPersonDetails } from "../services/tmdb";
import { ArrowLeft, Loader2, Film, MapPin, Calendar, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence

export default function Person() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("movie");

  useEffect(() => {
    window.scrollTo(0, 0);
    getPersonDetails(id).then((data) => {
      setPerson(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
    </div>
  );

  const cast = person?.combined_credits?.cast || [];
  
  const movies = cast
    .filter(item => item.media_type === "movie" && item.poster_path)
    .sort((a, b) => b.popularity - a.popularity);

  const shows = cast
    .filter(item => item.media_type === "tv" && item.poster_path)
    .sort((a, b) => b.popularity - a.popularity);

  const displayCredits = activeTab === "movie" ? movies : shows;

  return (
    <div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(145, 70, 255, 0.3); border-radius: 10px; }
      `}</style>
    <div className="px-4 pb-8 max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-xs text-gray-500 hover:text-white transition group cursor-pointer">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Profile Card */}
          <div className="w-full md:w-56 shrink-0 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <img 
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
                className="w-40 md:w-full mx-auto rounded-xl shadow-xl border border-white/5 object-cover aspect-2/3"
              />
            </motion.div>
            
            <div className="hidden md:block bg-white/5 p-3 rounded-xl border border-white/5 space-y-3">
              <div>
                <span className="font-title text-gray-500 block uppercase text-[9px] font-bold tracking-tighter">Born</span>
                <p className="text-xs">{person.birthday || "N/A"}</p>
              </div>
              <div>
                <span className="font-subtitle text-gray-500 block uppercase text-[9px] font-bold tracking-tighter">Place of Birth</span>
                <p className="text-xs leading-tight">{person.place_of_birth || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 min-w-0 space-y-6">
            <header className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-title font-bold tracking-tight text-center md:text-left"
              >
                {person.name}
              </motion.h1>
              
              <div className="font-subtitle flex md:hidden items-center justify-center gap-4 text-[11px] text-gray-400 border-y border-white/5 py-2">
                <span className="flex items-center gap-1"><Calendar size={12}/> {person.birthday || "N/A"}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {person.place_of_birth?.split(',').pop() || "N/A"}</span>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                <h3 className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-2">Biography</h3>
                <div className="max-h-32 md:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  <p className="font-paragraph text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {person.biography || `No biography available for ${person.name}.`}
                  </p>
                </div>
              </div>
            </header>

            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5">
                <h2 className="text-sm font-title font-bold flex items-center gap-2 uppercase tracking-wider text-gray-400">
                  <Film className="text-purple-500" size={16} /> Filmography
                </h2>
                
                <div className="flex font-title bg-white/5 p-1 rounded-lg mb-2 relative">
                  {["movie", "tv"].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold transition-colors z-10 ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      {tab === "movie" ? <Film size={12} /> : <Tv size={12} />}
                      {tab === "movie" ? "MOVIES" : "TV SHOWS"} ({tab === "movie" ? movies.length : shows.length})
                      
                      {activeTab === tab && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-purple-600 rounded-md -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated Grid Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3"
                >
                  {displayCredits.length > 0 ? (
                    displayCredits.slice(0, 30).map((media) => (
                      <Link 
                        key={`${media.media_type}-${media.id}`} 
                        to={`/watch/${media.media_type}/${media.id}`}
                        className="group flex flex-col gap-2"
                      >
                        <div className="aspect-2/3 relative overflow-hidden rounded-lg border border-white/5 group-hover:border-purple-500 transition-colors">
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                            alt={media.title || media.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold border border-white/10">
                             {media.vote_average?.toFixed(1)}
                          </div>
                        </div>
                        <div className="px-1">
                          <p className="text-[12px] font-title font-semibold truncate text-white leading-tight">{media.title || media.name}</p>
                          <p className="text-[10px] font-paragraph text-gray-500 truncate leading-tight">{media.character || "Cast"}</p>
                          <p className="text-[9px] font-paragraph text-purple-500/80 mt-0.5">
                            {activeTab === 'movie' ? (media.release_date?.split('-')[0]) : (media.first_air_date?.split('-')[0])}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                       <p className="text-gray-500 text-xs">No {activeTab === 'movie' ? 'movies' : 'TV shows'} found in our records.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}