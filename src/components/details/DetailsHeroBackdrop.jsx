import { Volume2, VolumeX } from "lucide-react";

export function DetailsHeroBackdrop({ movie, trailer, isMuted, toggleMute }) {
  return (
    <div className="absolute inset-0 z-0">
      {trailer ? (
        <div className="w-full h-full relative overflow-hidden">
          <iframe
            id="details-trailer-iframe"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&playsinline=1&origin=${window.location.origin}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350%] h-[350%] md:w-[120%] md:h-[120%] min-w-full min-h-full object-cover pointer-events-none opacity-100 scale-110"
            style={{ border: "none" }}
            allow="autoplay; encrypted-media"
            title="Trailer Backdrop"
          />
        </div>
      ) : (
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover opacity-50"
        />
      )}

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/40" />

      {trailer && (
        <button
          onClick={toggleMute}
          className="absolute right-8 top-32 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-2xl"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
    </div>
  );
}
