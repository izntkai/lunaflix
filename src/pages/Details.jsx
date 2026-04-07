import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getMovieInfo, getTvInfo, getPosterUrl, getBackdropUrl, getProfileUrl, BASE_URL, API_KEY } from "../services/tmdb";
import {
  ArrowLeft, Star, Calendar, Clock, Globe,
  Play, Plus, Share2, Heart,
  TrendingUp, Users, Video, Info, ChevronLeft, ChevronRight,
  Volume2, VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Details() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const castRef = useRef(null);
  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const title = details?.title || details?.name;
  const releaseDate = details?.release_date || details?.first_air_date;
  const runtime = details?.runtime || (details?.episode_run_time && details?.episode_run_time[0]);
  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");

  // Load YouTube API and Initialize Player
  useEffect(() => {
    if (!trailer) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('trailer-iframe', {
        events: {
          'onReady': (event) => {
            event.target.mute();
            setIsMuted(true);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      setTimeout(initPlayer, 500); // Give DOM a moment
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [trailer, id]);

  const toggleMute = () => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const scrollCast = (direction) => {
    if (castRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      castRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetails();
  }, [id, type]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const fetchFunc = type === "tv" ? getTvInfo : getMovieInfo;
      const data = await fetchFunc(id);
      setDetails(data);

      const [videosRes, recRes] = await Promise.all([
        fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`),
        fetch(`${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`)
      ]);

      const videosData = await videosRes.json();
      const recData = await recRes.json();

      setVideos(videosData.results || []);
      setRecommendations(recData.results?.slice(0, 6) || []);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="h-12 w-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  if (!details) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-purple-600/50 pt-20 px-4 md:px-20">
      {/* Balanced Hero Section */}
      <div className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden group/hero">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none scale-105">
          {trailer ? (
            <div className="w-full h-full relative">
              <iframe
                id="trailer-iframe"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`}
                className="w-full h-[150%] -mt-[15%] md:h-[180%] md:-mt-[20%] object-cover pointer-events-none"
                style={{ border: 'none' }}
                allow="autoplay; encrypted-media"
                title="Trailer Backdrop"
              />
            </div>
          ) : (
            <img src={getBackdropUrl(details.backdrop_path, 'original')} alt="bg" className="w-full h-full object-cover transform scale-105" />
          )}
          {/* Multi-stage Vignette */}
          <div className="absolute inset-0 bg-[#0f0f0f]/40 z-10 shadow-[inset_0_0_200px_rgba(15,15,15,0.8)]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/90 via-transparent to-transparent z-10"></div>
        </div>

        {/* Global Volume Control - Elevated to highest level */}
        {trailer && (
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="absolute bottom-10 right-10 z-[100] p-4 bg-black/60 backdrop-blur-3xl border border-white/20 rounded-full text-white hover:bg-purple-600 hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={24} className="opacity-70" /> : <Volume2 size={24} />}
          </button>
        )}

        <div className="absolute inset-0 z-10 flex flex-col justify-end pt-24 pointer-events-none">
          <div className="max-w-6xl mx-auto w-full px-0 pb-8 pointer-events-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end text-center md:text-left">
              <img
                src={getPosterUrl(details.poster_path, 'w500')}
                alt={title}
                className="relative w-32 md:w-44 aspect-[2/3] object-cover rounded-xl shadow-2xl border border-white/10"
              />
              <div className="flex-1 space-y-4">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold font-title tracking-tight leading-tight">
                  {title}
                </motion.h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium text-white/70">
                  {details.vote_average > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20">
                      <Star size={12} fill="currentColor" /> {details.vote_average.toFixed(1)}
                    </div>
                  )}
                  {releaseDate && <span>{new Date(releaseDate).getFullYear()}</span>}
                  {runtime && <span>{runtime} min</span>}
                  <span className="px-1.5 border border-white/20 rounded-sm text-[10px] font-black uppercase tracking-widest">HD</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                  <button
                    onClick={() => navigate(`/watch/${type}/${id}`)}
                    className="font-title flex items-center gap-2 bg-purple-500 text-black px-6 py-3 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-bold text-sm md:text-base shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <Play size={20} fill="currentColor" /> WATCH NOW
                  </button>
                  {trailer && (
                    <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white/10 rounded-xl font-bold border border-white/10 hover:bg-white/20 transition-all">
                      <Video size={18} /> TRAILER
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-0 py-10">
        <div className="flex font-title gap-8 mb-8 border-b border-white/5 pb-1">
          {['overview', 'cast', 'videos'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`relative pb-3 text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white'}`}>
              {tab}
              {activeTab === tab && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-full" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-title mb-4 flex items-center gap-2">THE STORY</h2>
                  <p className="text-white/90 text-lg leading-relaxed">{details.overview}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                  {[
                    { label: 'Status', value: details.status },
                    { label: 'Language', value: details.original_language?.toUpperCase() },
                    { label: 'Budget', value: details.budget > 0 ? `$${(details.budget / 1000000).toFixed(1)}M` : 'N/A' },
                    { label: 'Revenue', value: details.revenue > 0 ? `$${(details.revenue / 1000000).toFixed(1)}M` : 'N/A' }
                  ].map((stat, i) => (
                    <div key={i}><p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">{stat.label}</p><p className="font-title font-bold text-base">{stat.value}</p></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1 space-y-8">
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                  <h4 className="text-xs font-black uppercase text-purple-400 tracking-[0.2em] mb-4">Production</h4>
                  <div className="text-sm text-white/70 space-y-3">{details.production_companies?.slice(0, 4).map(c => <p key={c.id} className="flex items-center gap-2"><span className="h-1 w-1 bg-white/30 rounded-full" /> {c.name}</p>)}</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cast' && (
            <div className="relative group/cast-row">
              <button
                onClick={() => scrollCast('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center bg-black/50 backdrop-blur-xl border border-white/10 text-white rounded-full opacity-0 group-hover/cast-row:opacity-100 transition-all hover:bg-purple-600 hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.div
                ref={castRef}
                key="ca"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth snap-x snap-mandatory px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {details.credits?.cast?.slice(0, 16).map((person) => (
                  <Link
                    key={person.id}
                    to={`/person/${person.id}`}
                    className="group flex-none w-32 md:w-40 snap-start"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500 transition-all duration-500">
                      <img src={getProfileUrl(person.profile_path, 'w185')} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                    </div>
                    <div className="mt-3">
                      <p className="font-title font-bold text-lg truncate tracking-tight">{person.name}</p>
                      <p className="text-[11px] text-white/40 truncate">{person.character}</p>
                    </div>
                  </Link>
                ))}
              </motion.div>

              <button
                onClick={() => scrollCast('right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center bg-black/50 backdrop-blur-xl border border-white/10 text-white rounded-full opacity-0 group-hover/cast-row:opacity-100 transition-all hover:bg-purple-600 hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </AnimatePresence>

        {recommendations.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/5">
            <h2 className="text-2xl font-bold font-title uppercase tracking-tight mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {recommendations.map(item => (
                <Link key={item.id} to={`/details/${item.media_type || type}/${item.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500 transition-all duration-500">
                    <img src={getPosterUrl(item.poster_path, 'w300')} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3"><p className="text-[10px] font-black uppercase truncate">{item.title || item.name}</p></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
