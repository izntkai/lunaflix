import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getMovieInfo, getTvInfo, getEpisodeInfo } from "../services/tmdb";
import { servers } from "../constants/servers";
import { upsertContinueWatching } from "../services/library";

export function useWatch() {
  const { id } = useParams();
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
    fetchFunc(id)
      .then((data) => setMovie(data))
      .finally(() => setLoading(false));

    const timer = setTimeout(() => setCanInteract(true), 800);
    return () => clearTimeout(timer);
  }, [id, isTv]);

  useEffect(() => {
    if (!isTv) return;
    getEpisodeInfo(id, season, episode)
      .then((data) => setEpisodeDetails(data))
      .catch((err) => console.error(err));
  }, [id, season, episode, isTv]);

  useEffect(() => {
    if (!movie) return;

    const totalEpisodes = isTv
      ? movie.seasons?.find((s) => s.season_number === Number(season))?.episode_count || 1
      : 1;

    const progress = isTv
      ? Math.round((Number(episode) / totalEpisodes) * 100)
      : iframeLoading
        ? 15
        : 35;

    upsertContinueWatching({
      id: movie.id,
      type: mediaType,
      title: movie.title,
      name: movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      first_air_date: movie.first_air_date,
      season: Number(season),
      episode: Number(episode),
      progress,
    });
  }, [movie, mediaType, season, episode, isTv, iframeLoading]);

  const currentSeasonData = movie?.seasons?.find((s) => s.season_number === Number(season));
  const totalEpisodesInSeason = currentSeasonData?.episode_count || 0;

  const selectServer = (server) => {
    setIframeLoading(true);
    setCurrentServer(server);
  };

  const selectSeason = (nextSeason) => {
    setIframeLoading(true);
    setSeason(nextSeason);
  };

  const selectEpisode = (nextEpisode) => {
    setIframeLoading(true);
    setEpisode(nextEpisode);
  };

  const handleNextEpisode = () => {
    if (Number(episode) < totalEpisodesInSeason) {
      selectEpisode(Number(episode) + 1);
    } else if (Number(season) < movie.number_of_seasons) {
      selectSeason(Number(season) + 1);
      selectEpisode(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    id,
    isTv,
    mediaType,
    currentServer,
    setCurrentServer: selectServer,
    movie,
    loading,
    iframeLoading,
    setIframeLoading,
    canInteract,
    season,
    setSeason: selectSeason,
    episode,
    setEpisode: selectEpisode,
    episodeDetails,
    totalEpisodesInSeason,
    handleNextEpisode,
  };
}
