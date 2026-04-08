import { useNavigate } from "react-router-dom";
import { useWatch } from "../hooks/useWatch";
import { servers } from "../constants/servers";
import { CrewCard, CastScroll, DesktopSidebar, WatchHeader, MobileControls, DetailSection } from "../components/WatchComponents";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Watch() {
  const navigate = useNavigate();
  const {
    id, isTv, mediaType, currentServer, setCurrentServer,
    movie, loading, iframeLoading, setIframeLoading,
    canInteract, season, setSeason, episode, setEpisode,
    episodeDetails, totalEpisodesInSeason, handleNextEpisode
  } = useWatch();

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
    </div>
  );

  const episodeList = Array.from({ length: totalEpisodesInSeason }, (_, i) => i + 1);

  return (
    <div className={`transition-opacity duration-500 ${canInteract ? "opacity-100" : "opacity-90"} pb-20`}>
      <style>{`
        .custom-cast-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-cast-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 20px; }
        .custom-cast-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to right, #9146ff, #6d28d9); border-radius: 20px; }
      `}</style>

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0f0f0f]/95 z-10" />
        <img src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} alt="bg" className="w-full h-full object-cover blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-4">
        <WatchHeader navigate={navigate} isTv={isTv} movie={movie} episode={episode} season={season} totalEpisodesInSeason={totalEpisodesInSeason} handleNextEpisode={handleNextEpisode} />

        <motion.div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-white/10 relative">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10 font-bold">
              <Loader2 className="animate-spin text-purple-500 w-8 h-8 mb-2" />
              <p className="text-gray-500 text-xs animate-pulse uppercase text-center px-4">Loading secure stream...</p>
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

        <MobileControls isTv={isTv} movie={movie} season={season} setSeason={setSeason} setEpisode={setEpisode} episode={episode} episodeList={episodeList} currentServer={currentServer} setCurrentServer={setCurrentServer} servers={servers} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4 text-white">
            <DetailSection isTv={isTv} movie={movie} season={season} episode={episode} episodeDetails={episodeDetails} />
          </div>
          <DesktopSidebar isTv={isTv} movie={movie} season={season} setSeason={setSeason} episode={episode} setEpisode={setEpisode} episodeList={episodeList} servers={servers} currentServer={currentServer} setCurrentServer={setCurrentServer} />
        </div>
      </div>
    </div>
  );
}
              <CrewCard label="Cinematography" person={getCrewMember("Director of Photography")} />
              <CrewCard label="Producer" person={getCrewMember("Executive Producer")} />
            </div>

            {/* Cast Section */}
            <div className="pt-2">
              <h3 className="text-lg font-title font-semibold text-white mb-3 flex items-center gap-1.5">
                <Users size={14} /> {isTv ? "Episode Cast & Regulars" : "Movie Cast"}
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

          {/* DESKTOP SIDEBAR - Kept as is */}
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
                          : "bg-[#222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
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