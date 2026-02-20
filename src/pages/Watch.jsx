import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMovieInfo, getTvInfo } from "../services/tmdb";
import Navbar from "../components/Navbar";
import { 
  ArrowLeft, Server, Calendar, Star, Clock, 
  ShieldCheck, Loader2, Users, ThumbsUp, Share2,
  ChevronDown, Layers, ChevronRight, Play 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const servers = [
  { name: "VidSrc", url: (id, type, s, e) => `https://vidsrc.to/embed/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` },
  { name: "Vidsrc CC", url: (id, type, s, e) => `https://vidsrc.cc/v2/embed/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` },
  { name: "VidSrc Pro", url: (id, type, s, e) => `https://vidsrc.me/embed/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` },
  { name: "VidFast", url: (id, type, s, e) => `https://vidfast.pro/${type}/${id}${type === 'tv' ? `?s=${s}&e=${e}` : ''}` },
  { name: "VidLink", url: (id, type, s, e) => `https://vidlink.pro/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}` },
  { name: "VidKing", url: (id, type, s, e) => `https://www.vidking.net/embed/${type}/${id}${type === 'tv' ? `/${s}/${e}` : ''}?color=9146ff` },
  { name: "SuperEmbed", url: (id, type, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1${type === 'tv' ? `&s=${s}&e=${e}` : ''}` },
  { name: "Smashy", url: (id, type, s, e) => `https://player.smashy.stream/${type}/${id}${type === 'tv' ? `?s=${s}&e=${e}` : ''}` },
];

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isTv = location.pathname.includes("/tv/");
  const mediaType = isTv ? "tv" : "movie";

  const [currentServer, setCurrentServer] = useState(servers[0]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [canInteract, setCanInteract] = useState(false);
  
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodeDetails, setEpisodeDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFunc = isTv ? getTvInfo : getMovieInfo;
    
    fetchFunc(id).then((data) => {
      setMovie(data);
      setLoading(false);
    });

    const timer = setTimeout(() => setCanInteract(true), 800);
    return () => clearTimeout(timer);
  }, [id, isTv]);

  useEffect(() => {
    if (isTv) {
      const BASE_URL = "/.netlify/functions/tmdb-proxy";
      fetch(`${BASE_URL}/tv/${id}/season/${season}/episode/${episode}?append_to_response=credits`)
        .then(res => res.json())
        .then(data => setEpisodeDetails(data))
        .catch(err => console.error("Error fetching episode details:", err));
    }
    setIframeLoading(true);
  }, [id, season, episode, isTv]);

  const getCrewMember = (job) => movie?.credits?.crew?.find(c => c.job === job);
  const getWriter = () => movie?.credits?.crew?.find(c => ["Screenplay", "Writer", "Story"].includes(c.job));
  const getEpisodeDirector = () => episodeDetails?.crew?.find(c => c.job === "Director");

  const currentSeasonData = movie?.seasons?.find(s => s.season_number === Number(season));
  const totalEpisodesInSeason = currentSeasonData?.episode_count || 0;
  const episodeList = Array.from({ length: totalEpisodesInSeason }, (_, i) => i + 1);

  const hasNextEpisode = () => {
    if (!isTv || !movie) return false;
    const isLastEpisodeOfSeason = Number(episode) >= totalEpisodesInSeason;
    const isLastSeason = Number(season) >= movie.number_of_seasons;
    return !(isLastEpisodeOfSeason && isLastSeason);
  };

  const handleNextEpisode = () => {
    if (Number(episode) < totalEpisodesInSeason) {
      setEpisode(prev => Number(prev) + 1);
    } else if (Number(season) < movie.number_of_seasons) {
      setSeason(prev => Number(prev) + 1);
      setEpisode(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // UPDATED: Put Regulars FIRST, then Guest Stars
  const getDisplayCast = () => {
    if (isTv && episodeDetails) {
      const regulars = episodeDetails.credits?.cast || []; // Main cast for this episode
      const guests = episodeDetails.guest_stars || [];     // Guest stars for this episode
      
      // Combine with Regulars in front
      const combined = [...regulars, ...guests];
      
      // De-duplicate in case TMDB lists an actor in both
      const uniqueCast = Array.from(new Map(combined.map(item => [item.id, item])).values());
      
      return uniqueCast.slice(0, 25);
    }
    return movie?.credits?.cast?.slice(0, 20) || [];
  };

  const CrewCard = ({ label, person }) => (
    <div className={`flex items-center gap-3 group transition-transform hover:scale-105 ${!person && 'opacity-50'}`}>
      <Link 
        to={person ? `/person/${person.id}` : "#"} 
        className={`w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-gray-800 shrink-0 group-hover:border-purple-500/50 transition-colors ${!person && 'pointer-events-none'}`}
      >
        {person?.profile_path ? (
          <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500 uppercase font-bold">N/A</div>
        )}
      </Link>
      <div>
        <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none mb-1 group-hover:text-purple-400 transition-colors">{label}</span>
        <p className="text-xs text-white font-medium truncate max-w-[120px]">{person?.name || "Unknown"}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
    </div>
  );

  const title = movie?.title || movie?.name;
  const releaseDate = movie?.release_date || movie?.first_air_date;

  return (
    <div className={`min-h-screen bg-[#0f0f0f] text-gray-100 font-sans selection:bg-purple-500 pb-12 transition-opacity duration-500 ${canInteract ? "opacity-100" : "opacity-90"}`}>
      <style>{`
        .custom-cast-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-cast-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 20px; margin: 0 10px; }
        .custom-cast-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to right, #9146ff, #6d28d9); border-radius: 20px; }
        .custom-cast-scrollbar::-webkit-scrollbar-thumb:hover { background: #a855f7; }
      `}</style>

      <Navbar />
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0f0f0f]/95 z-10" />
        <img src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} alt="bg" className="w-full h-full object-cover blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto pt-24 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition group text-sm border border-white/5 cursor-pointer">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          {hasNextEpisode() && (
            <button onClick={handleNextEpisode} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm font-bold shadow-lg shadow-purple-600/20 cursor-pointer">
              <span>Next Episode</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <motion.div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-white/10 relative">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10">
              <Loader2 className="animate-spin text-purple-500 w-8 h-8 mb-2" />
              <p className="text-gray-500 text-xs animate-pulse">Loading secure stream...</p>
            </div>
          )}
          <iframe
            key={`${currentServer.name}-${season}-${episode}`}
            src={currentServer.url(id, mediaType, season, episode)}
            className={`w-full h-full transition-opacity duration-500 ${iframeLoading ? "opacity-0" : "opacity-100"}`}
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-title text-white mb-2 tracking-tight">
                {title} {isTv && <span className="text-purple-500/80 text-lg md:text-xl font-medium ml-2">S{season} E{episode}</span>}
              </h1>
              
              <div className="font-paragraph flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star size={14} fill="currentColor" /> {movie?.vote_average?.toFixed(1)}
                </span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {releaseDate?.split("-")[0]}</span>
                {movie?.runtime && <span className="flex items-center gap-1"><Clock size={14} /> {movie?.runtime}m</span>}
                {isTv && <span className="px-1.5 py-0.5 rounded border border-purple-500/50 text-purple-300 text-[10px] uppercase font-bold">{movie?.number_of_seasons} Seasons</span>}
                <span className="px-1.5 py-0.5 rounded border border-gray-700 text-[10px] uppercase font-bold">HD</span>
              </div>

              {isTv && episodeDetails && (
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl mb-6 relative group overflow-hidden">
                   <h3 className="text-purple-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Episode Details</h3>
                   <h4 className="text-white text-lg font-bold mb-2">{episodeDetails.name}</h4>
                   <p className="font-paragraph text-gray-300 leading-relaxed text-sm">
                    {episodeDetails.overview || "No overview available for this episode."}
                   </p>
                </div>
              )}
              <p className="font-paragraph text-gray-400 leading-relaxed text-sm line-clamp-3">{movie?.overview}</p>
            </div>

            <div className="font-title grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/5">
                {isTv ? (
                  <CrewCard label="Episode Director" person={getEpisodeDirector() || getCrewMember("Director")} />
                ) : (
                  <CrewCard label="Director" person={getCrewMember("Director")} />
                )}
                <CrewCard label="Writer" person={getWriter()} />
                <CrewCard label="Cinematography" person={getCrewMember("Director of Photography")} />
                <CrewCard label="Producer" person={getCrewMember("Executive Producer")} />
            </div>

            <div className="pt-2">
              <h3 className="text-lg font-title font-semibold text-white mb-3 flex items-center gap-1.5">
                <Users size={14} /> {isTv ? "Episode Full Cast" : "Movie Cast"}
              </h3>
              <div 
                className="flex gap-4 overflow-x-auto pb-6 custom-cast-scrollbar"
                style={{ maskImage: 'linear-gradient(to right, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent 100%)' }}
              >
                {getDisplayCast().map((actor) => (
                  <Link to={`/person/${actor.id}`} key={actor.credit_id || actor.id} className="flex-none w-20 text-center group">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(145,70,255,0.3)]">
                      {actor.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-[10px]">N/A</div>
                      )}
                    </div>
                    <p className="text-[11px] text-white font-title px-1 group-hover:text-purple-400 transition-colors truncate font-medium">{actor.name}</p>
                    <p className="text-[9px] text-gray-500 truncate px-1 italic line-clamp-1">{actor.character || "Regular"}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="space-y-4 sticky top-4">
                {isTv && (
                  <div className="bg-[#161616] border border-white/5 rounded-xl p-4 shadow-2xl">
                      <h3 className="text-sm font-title font-semibold text-white flex items-center gap-2 mb-3">
                        <Layers size={14} className="text-purple-500" /> Episode Selector
                      </h3>
                      <div className="space-y-3">
                        <div className="relative">
                          <span className="text-[10px] text-gray-500 uppercase font-bold ml-1 mb-1 block">Season</span>
                          <select 
                            value={season}
                            onChange={(e) => { setSeason(e.target.value); setEpisode(1); }}
                            className="w-full bg-[#222] text-white text-sm py-2 px-3 rounded-lg appearance-none border border-white/10 focus:border-purple-500 outline-none transition-all cursor-pointer"
                          >
                              {movie?.seasons?.filter(s => s.season_number > 0).map(s => (
                                <option key={s.id} value={s.season_number}>Season {s.season_number}</option>
                              ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-8 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        <div className="relative">
                          <span className="text-[10px] text-gray-500 uppercase font-bold ml-1 mb-1 block">Episode</span>
                          <select 
                            value={episode}
                            onChange={(e) => setEpisode(e.target.value)}
                            className="w-full bg-[#222] text-white text-sm py-2 px-3 rounded-lg appearance-none border border-white/10 focus:border-purple-500 outline-none transition-all cursor-pointer"
                          >
                              {episodeList.map(ep => (
                                <option key={ep} value={ep}>Episode {ep}</option>
                              ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-8 text-gray-400 pointer-events-none" size={14} />
                        </div>
                      </div>
                  </div>
                )}

                <div className="bg-[#161616] border border-white/5 rounded-xl p-4 shadow-2xl">
                  <h3 className="text-sm font-title font-semibold text-white flex items-center gap-2 mb-3">
                    <Server size={14} className="text-purple-500" /> Stream Source
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {servers.map((server) => (
                      <button
                        key={server.name}
                        onClick={() => setCurrentServer(server)}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg text-[10px] font-title font-bold uppercase tracking-wider transition-all duration-200 border border-transparent cursor-pointer
                          ${currentServer.name === server.name 
                            ? "bg-purple-600 text-white shadow-lg border-purple-500/50" 
                            : "bg-[#222] text-gray-500 hover:bg-[#2a2a2a] hover:text-white"
                          }`}
                      >
                        {server.name}
                      </button>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}