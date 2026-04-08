import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Calendar, Globe, Play, Video, Volume2, VolumeX } from "lucide-react";

export function DetailsHero({ movie, trailer, type, id }) {
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const retriesRef = useRef(0);
  const retryTimerRef = useRef(null);
  const onApiReadyRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (!trailer) return;

    let isActive = true;
    const maxRetries = 12;
    const previousOnApiReady = window.onYouTubeIframeAPIReady;

    retriesRef.current = 0;

    const clearRetryTimer = () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };

    const scheduleRetry = (initPlayer) => {
      if (!isActive || retriesRef.current >= maxRetries) return;

      retriesRef.current += 1;
      clearRetryTimer();
      retryTimerRef.current = window.setTimeout(initPlayer, 250);
    };

    const initPlayer = () => {
      if (!isActive || playerRef.current) return;

      const iframe = document.getElementById("details-trailer-iframe");
      if (!iframe || !window.YT?.Player) {
        scheduleRetry(initPlayer);
        return;
      }

      try {
        playerRef.current = new window.YT.Player("details-trailer-iframe", {
          events: {
            onReady: (event) => {
              if (!isActive) return;

              event.target.mute();
              setIsMuted(true);
              setPlayerReady(true);
              if (typeof event.target.playVideo === "function") {
                event.target.playVideo();
              }
            },
            onError: () => {
              if (!isActive) return;
              setPlayerReady(false);
            }
          }
        });
      } catch {
        scheduleRetry(initPlayer);
      }
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }

    onApiReadyRef.current = () => {
      if (typeof previousOnApiReady === "function") {
        previousOnApiReady();
      }
      initPlayer();
    };

    window.onYouTubeIframeAPIReady = onApiReadyRef.current;
    initPlayer();

    return () => {
      isActive = false;
      clearRetryTimer();

      if (window.onYouTubeIframeAPIReady === onApiReadyRef.current) {
        window.onYouTubeIframeAPIReady = previousOnApiReady;
      }

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [trailer, id]);

  const toggleMute = () => {
    if (!playerRef.current || !playerReady) return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      return;
    }

    playerRef.current.mute();
    setIsMuted(true);
  };

  return (
    <div className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden group/hero">
      <div className="absolute inset-0">
        {trailer ? (
          <div className="w-full h-full relative">
            <iframe
              id="details-trailer-iframe"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&playsinline=1&origin=${window.location.origin}`}
              className="w-full h-[150%] -mt-[15%] md:h-[180%] md:-mt-[20%] object-cover pointer-events-none"
              style={{ border: "none" }}
              allow="autoplay; encrypted-media"
              title="Trailer Backdrop"
            />
          </div>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-[#0f0f0f]/40 shadow-[inset_0_0_200px_rgba(15,15,15,0.8)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/90 via-transparent to-transparent" />
      </div>

      {trailer && (
        <button
          onClick={toggleMute}
          className="absolute right-8 bottom-14 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition"
          aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      <div className="relative z-20 h-full flex items-end px-6 md:px-12 pb-6 md:pb-10 max-w-7xl mx-auto">
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 items-end">
          <div className="w-40 sm:w-48 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
          </div>

          <div className="flex-1 space-y-4 md:mb-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {type === "movie" ? "Movie" : "TV Series"}
              </span>
              {movie.status && (
                <span className="bg-white/10 backdrop-blur-md text-gray-300 px-3 py-1 rounded-full text-xs border border-white/10">
                  {movie.status}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-title font-bold text-white drop-shadow-2xl leading-tight">
              {movie.title || movie.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300 font-medium">
              <div className="flex items-center gap-2 text-purple-400">
                <Star size={20} fill="currentColor" />
                <span className="text-white font-bold">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-gray-500">TMDB</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-purple-500/70" />
                {(movie.release_date || movie.first_air_date)?.split("-")[0]}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={18} className="text-purple-500/70" />
                {type === "movie" && movie.runtime
                  ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                  : movie.episode_run_time?.[0]
                    ? `${movie.episode_run_time[0]} min`
                    : "-"}
              </div>

              <div className="flex items-center gap-2 uppercase">
                <Globe size={18} className="text-purple-500/70" />
                {movie.original_language}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate(`/watch/${type}/${id}`)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-black font-black px-7 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_22px_rgba(147,51,234,0.45)]"
              >
                <Play fill="currentColor" size={18} />
                WATCH NOW
              </button>

              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-black px-7 py-3 rounded-2xl transition-all"
                >
                  <Video size={18} />
                  TRAILER
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {movie.genres?.map((g) => (
                <span key={g.id} className="text-xs md:text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-1.5 rounded-xl transition-colors">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
