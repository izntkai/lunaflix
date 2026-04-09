import { ChevronDown, Server, ArrowLeft, ChevronRight } from "lucide-react";

export const DesktopSidebar = ({
  isTv, movie, season, setSeason, episode, setEpisode,
  episodeList, servers, currentServer, setCurrentServer
}) => (
  <div className="hidden lg:block space-y-6">
    {isTv && (
      <div className="space-y-3 bg-white/[0.04] p-4 rounded-2xl border border-white/5">
        <div>
          <p className="text-[10px] uppercase text-white/45 tracking-wide font-semibold mb-1">Season</p>
          <div className="relative group">
            <select
              value={season}
              onChange={(e) => { setSeason(e.target.value); setEpisode(1); }}
              className="w-full bg-white/[0.03] text-white text-sm py-2.5 px-3 rounded-xl border border-white/10 outline-none appearance-none hover:border-white/20 transition cursor-pointer font-medium"
            >
              {movie?.seasons?.filter(s => s.season_number > 0).map(s => (
                <option key={s.id} value={s.season_number}>Season {s.season_number}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" size={15} />
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/45 tracking-wide font-semibold mb-1">Episode</p>
          <div className="relative group">
            <select
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              className="w-full bg-white/[0.03] text-white text-sm py-2.5 px-3 rounded-xl border border-white/10 outline-none appearance-none hover:border-white/20 transition cursor-pointer font-medium"
            >
              {episodeList.map(ep => (
                <option key={ep} value={ep}>Episode {ep}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" size={15} />
          </div>
        </div>
      </div>
    )}
    <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/5">
      <h3 className="text-lg font-semibold text-white font-title mb-3 flex items-center gap-2">
        <Server size={15} className="text-purple-400" />
        Stream Source
      </h3>
      <div className="grid grid-cols-2 gap-2">
          {servers.map((s) => (
            <button
              key={s.name}
              onClick={() => setCurrentServer(s)}
              className={`w-full px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-[13px] font-semibold ${
                currentServer.name === s.name
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white"
                  : "bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {s.name}
            </button>
          ))}
      </div>
    </div>
  </div>
);

export const WatchHeader = ({ navigate, isTv, movie, episode, season, totalEpisodesInSeason, handleNextEpisode }) => {
  const hasNextEpisode = isTv && movie && !(Number(episode) >= totalEpisodesInSeason && Number(season) >= movie.number_of_seasons);
  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition group text-sm border border-white/5 cursor-pointer">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>
      {hasNextEpisode && (
        <button onClick={handleNextEpisode} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm font-bold shadow-lg shadow-purple-600/20 cursor-pointer">
          <span>Next Episode</span>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export const MobileControls = ({ isTv, movie, season, setSeason, setEpisode, episode, episodeList, currentServer, setCurrentServer, servers }) => (
  <div className="lg:hidden mt-4 space-y-3">
    {isTv && (
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <select value={season} onChange={(e) => { setSeason(e.target.value); setEpisode(1); }} className="w-full bg-[#161616] text-white text-sm py-3 px-4 rounded-xl border border-white/10 outline-none appearance-none">
            {movie?.seasons?.filter(s => s.season_number > 0).map(s => <option key={s.id} value={s.season_number}>Season {s.season_number}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" size={16} />
        </div>
        <div className="relative">
          <select value={episode} onChange={(e) => setEpisode(e.target.value)} className="w-full bg-[#161616] text-white text-sm py-3 px-4 rounded-xl border border-white/10 outline-none appearance-none">
            {episodeList.map(ep => <option key={ep} value={ep}>Episode {ep}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none" size={16} />
        </div>
      </div>
    )}
    <div className="relative">
      <select value={currentServer.name} onChange={(e) => setCurrentServer(servers.find(s => s.name === e.target.value))} className="w-full bg-purple-600/20 text-purple-300 text-sm py-3 px-4 rounded-xl border border-purple-500/30 outline-none appearance-none font-bold">
        {servers.map((s) => <option key={s.name} value={s.name} className="bg-[#161616] text-white">Server: {s.name}</option>)}
      </select>
      <Server className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" size={16} />
    </div>
  </div>
);
