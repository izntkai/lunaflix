import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMovieInfo, getTvInfo } from "../services/tmdb";
import Navbar from "../components/Navbar";
import { 
  ArrowLeft, Server, Calendar, Star, Clock, 
  ShieldCheck, Loader2, Cast, ThumbsUp, Share2, ChevronDown, Play 
} from "lucide-react";
import { motion } from "framer-motion";

const servers = [
  { 
    name: "VidSrc", 
    url: (id, type, s, e) => type === 'tv' 
      ? `https://vidsrc.to/embed/tv/${id}/${s}/${e}` 
      : `https://vidsrc.to/embed/movie/${id}` 
  },
  { 
    name: "VidLink", 
    url: (id, type, s, e) => type === 'tv' 
      ? `https://vidlink.pro/tv/${id}/${s}/${e}` 
      : `https://vidlink.pro/movie/${id}` 
  },
  { 
    name: "Vidsrc CC", 
    url: (id, type, s, e) => type === 'tv' 
      ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` 
      : `https://vidsrc.cc/v2/embed/movie/${id}` 
  },
  { 
    name: "SuperEmbed", 
    url: (id, type, s, e) => type === 'tv'
      ? `https://multiembed.mov/?video_id=${id}&tmdb=1&type=tv&season=${s}&episode=${e}`
      : `https://multiembed.mov/?video_id=${id}&tmdb=1` 
  },
  { 
    name: "VidFast", 
    url: (id, type, s, e) => type === 'tv' 
      ? `https://vidfast.pro/tv/${id}/${s}/${e}` 
      : `https://vidfast.pro/movie/${id}` 
  },
  { 
    name: "Smashy", 
    url: (id, type, s, e) => type === 'tv'
      ? `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`
      : `https://player.smashy.stream/movie/${id}`
  },
];

export default function Watch() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detect type from URL
  const isTv = location.pathname.includes("/tv/");
  const mediaType = isTv ? "tv" : "movie";

  const [currentServer, setCurrentServer] = useState(servers[0]);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  
  // TV Show State
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFunc = isTv ? getTvInfo : getMovieInfo;
    fetchFunc(id).then((data) => {
      setMedia(data);
      setLoading(false);
    });
  }, [id, isTv]);

  useEffect(() => { setIframeLoading(true); }, [currentServer, season, episode]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
    </div>
  );

  const title = media?.title || media?.name;
  const releaseDate = media?.release_date || media?.first_air_date;
  const runtime = media?.runtime || (media?.episode_run_time ? media.episode_run_time[0] : null);

  // Helper to get episode count for the selected season
  const currentSeasonData = media?.seasons?.find(s => s.season_number === season);
  const totalEpisodes = currentSeasonData?.episode_count || 0;
  const episodeList = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 selection:bg-purple-500/30 pb-12">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(145, 70, 255, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(145, 70, 255, 0.7); }
      `}</style>

      <Navbar />
      
      <div className="relative z-10 max-w-5xl mx-auto pt-24 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-sm text-gray-500 hover:text-white transition group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10">
              <Loader2 className="animate-spin text-purple-500 w-8 h-8 mb-2" />
              <p className="text-gray-500 text-xs animate-pulse">Loading Secure Stream...</p>
            </div>
          )}
          <iframe
            key={`${currentServer.name}-${season}-${episode}`}
            src={currentServer.url(id, mediaType, season, episode)}
            className="w-full h-full"
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- TV SHOW EPISODE SELECTOR --- */}
            {isTv && media?.seasons && (
              <div className="bg-[#161616] border border-white/5 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Play size={14} className="text-purple-500" /> Episodes
                  </h3>
                  
                  {/* Season Dropdown */}
                  <div className="relative">
                    <select 
                      value={season} 
                      onChange={(e) => {
                        setSeason(Number(e.target.value));
                        setEpisode(1); // Reset episode when season changes
                      }}
                      className="bg-[#222] text-xs font-bold text-white px-3 py-1.5 pr-8 rounded-lg appearance-none border border-white/10 outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {media.seasons
                        .filter(s => s.season_number > 0) // Filter out Season 0 (Specials) if desired
                        .map((s) => (
                          <option key={s.id} value={s.season_number}>Season {s.season_number}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Episode Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {episodeList.map((epNum) => (
                    <button
                      key={epNum}
                      onClick={() => setEpisode(epNum)}
                      className={`text-xs py-2 rounded-md font-medium transition-all duration-200 border border-transparent
                        ${episode === epNum 
                          ? "bg-purple-600 text-white shadow-md border-purple-500" 
                          : "bg-[#252525] text-gray-400 hover:bg-[#333] hover:text-white"
                        }`}
                    >
                      {epNum}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <header>
              <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star size={14} fill="currentColor" /> {media?.vote_average?.toFixed(1)}
                </span>
                <span>{releaseDate?.split("-")[0]}</span>
                {runtime && <span>{runtime}m</span>}
                {isTv && <span className="text-purple-400 font-bold">S{season}:E{episode}</span>}
                <span className="text-[10px] border border-gray-700 px-1 rounded uppercase">HD</span>
              </div>
            </header>

            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{media?.overview}</p>

            {/* Cast List */}
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Top Cast</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {media?.credits?.cast?.slice(0, 12).map(actor => (
                  <Link key={actor.id} to={`/person/${actor.id}`} className="shrink-0 w-20 group">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border border-white/10 group-hover:border-purple-500 transition-colors">
                      {actor.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} className="w-full h-full object-cover" alt={actor.name} />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-[8px]">N/A</div>
                      )}
                    </div>
                    <p className="text-[10px] mt-2 text-white truncate text-center font-medium">{actor.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
             {/* Server Selector */}
             <div className="bg-[#161616] p-4 rounded-xl border border-white/10 sticky top-4">
               <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 flex items-center gap-2">
                 <Server size={14} className="text-purple-500"/> Select Server
               </h3>
               
               {/* Mobile Dropdown for Server */}
               <div className="lg:hidden relative mb-2">
                  <select 
                    onChange={(e) => setCurrentServer(servers.find(s => s.name === e.target.value))}
                    className="w-full bg-[#222] text-white text-xs py-2.5 px-3 rounded-lg appearance-none border border-white/10 focus:border-purple-500 outline-none"
                  >
                    {servers.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
               </div>

               {/* Desktop List for Server */}
               <div className="hidden lg:grid grid-cols-1 gap-2">
                 {servers.map(s => (
                   <button 
                    key={s.name} 
                    onClick={() => setCurrentServer(s)}
                    className={`text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all border border-transparent
                      ${currentServer.name === s.name 
                        ? 'bg-purple-600 text-white shadow-lg border-purple-500/50' 
                        : 'bg-[#222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                      }`}
                   >
                     {s.name}
                   </button>
                 ))}
               </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}