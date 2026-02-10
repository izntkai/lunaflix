import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMovieInfo } from "../services/tmdb";
import Navbar from "../components/Navbar";
import { 
  ArrowLeft, Server, Calendar, Star, Clock, 
  ShieldCheck, Loader2, Cast, ThumbsUp, Share2 
} from "lucide-react";
import { motion } from "framer-motion";

const servers = [
  { name: "VidSrc", url: (id) => `https://vidsrc.to/embed/movie/${id}` },
  { name: "Vidsrc CC", url: (id) => `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: "VidFast", url: (id) => `https://vidfast.pro/movie/${id}` },
  { name: "VidSrc Pro", url: (id) => `https://vidsrc.me/embed/movie/${id}` },
  { name: "VidEasy", url: (id) => `https://player.videasy.net/movie/${id}` },
  { name: "VidLink", url: (id) => `https://vidlink.pro/movie/${id}` },
  { name: "VidKing", url: (id) => `https://www.vidking.net/embed/movie/${id}?color=9146ff` },
  { name: "2Embed", url: (id) => `https://www.2embed.cc/embed/${id}` },
  { name: "AutoEmbed", url: (id) => `https://player.autoembed.cc/embed/movie/${id}` },
  { name: "SuperEmbed", url: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  { name: "Smashy", url: (id) => `https://player.smashy.stream/movie/${id}` },
];

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentServer, setCurrentServer] = useState(servers[0]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  
  // Safety state: Blocks interactions for a short moment
  const [interactionReady, setInteractionReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getMovieInfo(id).then((data) => {
      setMovie(data);
      setLoading(false);
    });

    // 1. SAFETY LOCK: Block ALL clicks for 500ms to prevent ghost clicks
    const timer = setTimeout(() => {
      setInteractionReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    setIframeLoading(true);
  }, [currentServer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 font-sans selection:bg-purple-500 selection:text-white pb-12 relative">
      
      {/* --- GHOST CLICK SHIELD --- */}
      {/* This invisible layer sits on top of everything for 0.5s to catch stray taps */}
      {!interactionReady && (
        <div className="fixed inset-0 z-9999 bg-transparent" />
      )}

      <Navbar />
      
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0f0f0f]/95 z-10" />
        <img
          src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
          alt="background"
          className="w-full h-full object-cover blur-3xl opacity-20"
        />
      </div>

      {/* --- Main Container --- */}
      <div className="relative z-10 max-w-5xl mx-auto pt-24 px-4 py-4">
        
        {/* --- Navigation --- */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (interactionReady) navigate(-1);
            }}
            // Only show full opacity when ready to prevent confusion
            style={{ opacity: interactionReady ? 1 : 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition group text-sm cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* --- Video Player Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-white/10 relative"
        >
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10">
              <Loader2 className="animate-spin text-purple-500 w-8 h-8 mb-2" />
              <p className="text-gray-500 text-xs animate-pulse">Loading secure stream...</p>
            </div>
          )}
          
          <iframe
            key={currentServer.name}
            src={currentServer.url(id)}
            className={`w-full h-full transition-opacity duration-500 ${iframeLoading ? "opacity-0" : "opacity-100"}`}
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </motion.div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* LEFT COLUMN: Movie Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Title & Stats */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-title text-white mb-2 tracking-tight">
                {movie?.title}
              </h1>
              
              <div className="font-paragraph flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={14} fill="currentColor" /> {movie?.vote_average?.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {movie?.release_date?.split("-")[0]}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {movie?.runtime}m
                </span>
                <span className="px-1.5 py-0.5 rounded border border-gray-700 text-[10px] uppercase">HD</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-600/20 text-purple-300 text-[10px] uppercase border border-purple-500/30">
                  {movie?.genres?.[0]?.name}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 py-3 border-y border-white/5">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition text-xs font-medium">
                <ThumbsUp size={14} /> Like
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition text-xs font-medium">
                <Share2 size={14} /> Share
              </button>
              <div className="flex-1" />
              <div className="flex items-center gap-1.5 text-purple-400 text-xs">
                 <ShieldCheck size={14} /> Secure
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <p className="font-paragraph text-gray-300 leading-relaxed text-sm">
                {movie?.overview}
              </p>
            </div>

            {/* Cast */}
            {movie?.credits?.cast?.length > 0 && (
              <div>
                <h3 className="text-lg font-title font-semibold text-white mb-2 flex items-center gap-1.5">
                  <Cast size={14} /> Cast
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {movie.credits.cast.slice(0, 6).map((actor) => (
                    <div key={actor.id} className="flex-none w-16 text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-full overflow-hidden border border-white/10">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-[10px]">N/A</div>
                        )}
                      </div>
                      <p className="text-[10px] text-white font-title">{actor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Server List */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#161616] border border-white/5 rounded-xl p-4 sticky top-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-title font-semibold text-white flex items-center gap-2">
                  <Server size={14} className="text-purple-500" /> 
                  Servers
                </h3>
                <span className="font-paragraph text-[10px] text-gray-500 uppercase tracking-wider">
                  Switch if needed
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {servers.map((server) => (
                  <button
                    key={server.name}
                    onClick={() => setCurrentServer(server)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-title font-medium transition-all duration-200 border border-transparent
                      ${currentServer.name === server.name 
                        ? "bg-purple-600/90 text-white shadow-md border-purple-500/50" 
                        : "bg-[#222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                      }`}
                  >
                    {server.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}