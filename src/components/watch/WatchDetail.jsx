import { Star, Calendar, Clock } from "lucide-react";
import { CrewCard, CastScroll } from "./CastCrew";

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
