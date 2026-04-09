import { Star, Calendar, Clock, ChevronDown, Server, ArrowLeft, ChevronRight, Users } from "lucide-react";

export const CrewCard = ({ label, person, fallbackName = "Unknown" }) => (
  <div className="flex items-center gap-3 min-w-0">
    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-[10px] text-white/40 font-semibold shrink-0">
      {person?.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
          alt={person?.name || label}
          className="w-full h-full object-cover"
        />
      ) : (
        "N/A"
      )}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-white/35 uppercase tracking-wide font-semibold leading-none mb-1">{label}</p>
      <p className="text-sm text-white font-semibold truncate">{person?.name || fallbackName}</p>
    </div>
  </div>
);

export const CastScroll = ({ cast, isTv }) => (
  <div className="pt-6 border-t border-white/5">
    <h3 className="text-2xl font-semibold mb-4 text-white font-title flex items-center gap-2">
      <Users size={17} className="text-white/80" />
      {isTv ? "Episode Cast & Regulars" : "Top Cast"}
    </h3>
    <div className="flex overflow-x-auto gap-3 pb-4 custom-cast-scrollbar">
      {cast?.map((person) => (
        <div key={person.id} className="flex-shrink-0 w-[78px] md:w-[86px] group text-left">
          <div className="aspect-square rounded-xl overflow-hidden mb-2 border border-white/10 group-hover:border-purple-500/60 transition-colors">
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                alt={person.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-900/80 flex items-center justify-center text-xs font-semibold text-white/70">N/A</div>
            )}
          </div>
          <p className="text-[11px] font-semibold text-white truncate leading-tight group-hover:text-purple-300 transition-colors">{person.name}</p>
          <p className="text-[10px] text-white/40 truncate italic">{person.character}</p>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-y border-white/5 font-title">
        <CrewCard label={isTv ? "Episode Director" : "Director"} person={isTv ? (getEpisodeDirector() || getCrewMember("Director")) : getCrewMember("Director")} fallbackName="Unknown" />
        <CrewCard label="Writer" person={getWriter()} fallbackName="Unknown" />
        <CrewCard label="Cinematography" person={getCrewMember("Director of Photography")} fallbackName="Unknown" />
        <CrewCard label="Producer" person={getCrewMember("Executive Producer")} fallbackName="Unknown" />
      </div>
      <CastScroll isTv={isTv} cast={getCast()} />
    </>
  );
};