import { Star, Calendar, Clock, ChevronDown, Server, ArrowLeft, ChevronRight } from "lucide-react";

export const CrewCard = ({ label, person }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] text-purple-500 uppercase font-black tracking-widest">{label}</span>
    <span className="text-sm font-bold truncate pr-2">{person?.name || "N/A"}</span>
  </div>
);

export const CastScroll = ({ cast, isTv }) => (
  <div className="pt-6">
    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-purple-500 font-title">
      {isTv ? "Episode Cast" : "Lead Cast"}
    </h3>
    <div className="flex overflow-x-auto gap-4 pb-4 custom-cast-scrollbar">
      {cast?.map((person) => (
        <div key={person.id} className="flex-shrink-0 w-24 md:w-28 group text-center">
          <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 group-hover:border-purple-500/50 transition-colors shadow-lg">
            <img
              src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : "https://via.placeholder.com/185x278?text=No+Image"}
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <p className="text-[11px] font-bold text-white truncate px-1 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{person.name}</p>
          <p className="text-[9px] text-gray-500 truncate px-1 uppercase tracking-tighter">{person.character}</p>
        </div>
      ))}
    </div>
  </div>
);

export const DesktopSidebar = ({
  isTv, movie, season, setSeason, episode, setEpisode,
  episodeList, servers, currentServer, setCurrentServer
}) => (
  <div className="hidden lg:block space-y-6">
    {isTv && (
      <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 font-title">Episode Select</h3>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">TV SERIES</span>
        </div>
        <div className="relative group">
          <select
            value={season}
            onChange={(e) => { setSeason(e.target.value); setEpisode(1); }}
            className="w-full bg-[#161616] text-white text-sm py-3.5 px-4 rounded-xl border border-white/10 outline-none appearance-none hover:border-purple-500/50 transition cursor-pointer font-bold"
          >
            {movie?.seasons?.filter(s => s.season_number > 0).map(s => (
              <option key={s.id} value={s.season_number}>Season {s.season_number}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 group-hover:scale-110 transition-transform pointer-events-none" size={16} />
        </div>
        <div className="relative group">
          <select
            value={episode}
            onChange={(e) => setEpisode(e.target.value)}
            className="w-full bg-[#161616] text-white text-sm py-3.5 px-4 rounded-xl border border-white/10 outline-none appearance-none hover:border-purple-500/50 transition cursor-pointer font-bold"
          >
            {episodeList.map(ep => (
              <option key={ep} value={ep}>Episode {ep}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 group-hover:scale-110 transition-transform pointer-events-none" size={16} />
        </div>
      </div>
    )}
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-[1px] rounded-3xl shadow-xl shadow-purple-900/20">
      <div className="bg-[#0f0f0f] p-6 rounded-[23px] space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 font-title">Stream Server</h3>
        <div className="grid gap-2">
          {servers.map((s) => (
            <button
              key={s.name}
              onClick={() => setCurrentServer(s)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                currentServer.name === s.name
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Server size={14} className={currentServer.name === s.name ? "text-white" : "text-purple-500"} />
                <span className="text-sm font-bold uppercase tracking-tight">{s.name}</span>
              </div>
              {currentServer.name === s.name && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          ))}
        </div>
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

export const DetailSection = ({ isTv, movie, season, episode, episodeDetails }) => {
  const title = movie?.title || movie?.name;
  const releaseDate = movie?.release_date || movie?.first_air_date;
  const getCrewMember = (job) => movie?.credits?.crew?.find(c => c.job === job);
  const getWriter = () => movie?.credits?.crew?.find(c => ["Screenplay", "Writer", "Story"].includes(c.job));
  const getEpisodeDirector = () => episodeDetails?.crew?.find(c => c.job === "Director");
  const getCast = () => {
    if (isTv && episodeDetails) {
      const combined = [...(episodeDetails.credits?.cast || []), ...(episodeDetails.guest_stars || [])];
      return Array.from(new Map(combined.map(item => [item.id, item])).values()).slice(0, 25);
    }
    return movie?.credits?.cast?.slice(0, 20) || [];
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold font-title mb-2 tracking-tight">
        {title} {isTv && <span className="text-purple-500/80 text-xl ml-2 font-title">S{season} E{episode}</span>}
      </h1>
      <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 mb-6 font-title">
        <span className="flex items-center gap-1 text-yellow-400 font-semibold"><Star size={14} fill="currentColor" /> {movie?.vote_average?.toFixed(1)}</span>
        <span className="flex items-center gap-1"><Calendar size={14} /> {releaseDate?.split("-")[0]}</span>
        {movie?.runtime && <span className="flex items-center gap-1"><Clock size={14} /> {movie?.runtime}m</span>}
      </div>
      {isTv && episodeDetails && (
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl mb-6">
          <h3 className="text-purple-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2 font-title">Episode Details</h3>
          <h4 className="text-white text-lg font-bold mb-2 font-title">{episodeDetails.name}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{episodeDetails.overview || "No overview available."}</p>
        </div>
      )}
      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{movie?.overview}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-white/5 font-title">
        <CrewCard label={isTv ? "Episode Director" : "Director"} person={isTv ? (getEpisodeDirector() || getCrewMember("Director")) : getCrewMember("Director")} />
        <CrewCard label="Writer" person={getWriter()} />
        <CrewCard label="Cinematography" person={getCrewMember("Director of Photography")} />
        <CrewCard label="Producer" person={getCrewMember("Executive Producer")} />
      </div>
      <CastScroll isTv={isTv} cast={getCast()} />
    </>
  );
};