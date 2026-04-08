import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getMovieInfo, getTvInfo, getEpisodeInfo } from "../services/tmdb";
import { servers } from "../constants/servers";

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
    fetchFunc(id).then((data) => {
      setMovie(data);
      setLoading(false);
    });
    const timer = setTimeout(() => setCanInteract(true), 800);
    return () => clearTimeout(timer);
  }, [id, isTv]);

  useEffect(() => {
    if (isTv) {
      getEpisodeInfo(id, season, episode)
        .then(data => setEpisodeDetails(data))
        .catch(err => console.error(err));
    }
    setIframeLoading(true);
  }, [id, season, episode, isTv]);

  const currentSeasonData = movie?.seasons?.find(s => s.season_number === Number(season));
  const totalEpisodesInSeason = currentSeasonData?.episode_count || 0;

  const handleNextEpisode = () => {
    if (Number(episode) < totalEpisodesInSeason) {
      setEpisode(prev => Number(prev) + 1);
    } else if (Number(season) < movie.number_of_seasons) {
      setSeason(prev => Number(prev) + 1);
      setEpisode(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    id, isTv, mediaType, currentServer, setCurrentServer,
    movie, loading, iframeLoading, setIframeLoading,
    canInteract, season, setSeason, episode, setEpisode,
    episodeDetails, totalEpisodesInSeason, handleNextEpisode
  };
}
