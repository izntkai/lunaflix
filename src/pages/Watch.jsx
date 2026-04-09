import { useNavigate } from "react-router-dom";
import { useWatch } from "../hooks/useWatch";
import { servers } from "../constants/servers";
import { WatchHeader, MobileControls, DesktopSidebar } from "../components/watch/WatchControls";
import { DetailSection } from "../components/watch/WatchDetail";
import { Loader2 } from "lucide-react";

export default function Watch() {
  const navigate = useNavigate();
  const {
    id,
    isTv,
    mediaType,
    currentServer,
    setCurrentServer,
    movie,
    loading,
    iframeLoading,
    setIframeLoading,
    canInteract,
    season,
    setSeason,
    episode,
    setEpisode,
    episodeDetails,
    totalEpisodesInSeason,
    handleNextEpisode,
  } = useWatch();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      </div>
    );
  }

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
        <img
          src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
          alt="bg"
          className="w-full h-full object-cover blur-3xl opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-4">
        <WatchHeader
          navigate={navigate}
          isTv={isTv}
          movie={movie}
          episode={episode}
          season={season}
          totalEpisodesInSeason={totalEpisodesInSeason}
          handleNextEpisode={handleNextEpisode}
        />

        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-white/10 relative">
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
        </div>

        <MobileControls
          isTv={isTv}
          movie={movie}
          season={season}
          setSeason={setSeason}
          setEpisode={setEpisode}
          episode={episode}
          episodeList={episodeList}
          currentServer={currentServer}
          setCurrentServer={setCurrentServer}
          servers={servers}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4 text-white">
            <DetailSection
              isTv={isTv}
              movie={movie}
              season={season}
              episode={episode}
              episodeDetails={episodeDetails}
            />
          </div>
          <DesktopSidebar
            isTv={isTv}
            movie={movie}
            season={season}
            setSeason={setSeason}
            episode={episode}
            setEpisode={setEpisode}
            episodeList={episodeList}
            servers={servers}
            currentServer={currentServer}
            setCurrentServer={setCurrentServer}
          />
        </div>
      </div>
    </div>
  );
}
