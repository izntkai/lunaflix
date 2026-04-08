import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieInfo, getTvInfo, getVideos, getRecommendations } from "../services/tmdb";

export function useMovieDetails() {
  const { type, id } = useParams();
  const [data, setData] = useState({ movie: null, trailer: null, recommendations: [], cast: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const fetchFn = type === "movie" ? getMovieInfo : getTvInfo;
        const [movieRes, videoRes, recommendRes] = await Promise.all([
          fetchFn(id),
          getVideos(type, id),
          getRecommendations(type, id)
        ]);

        const trailer = videoRes.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        setData({
          movie: movieRes,
          trailer: trailer || null,
          recommendations: recommendRes.results?.slice(0, 10) || [],
          cast: movieRes.credits?.cast?.slice(0, 12) || []
        });
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [type, id]);

  return { ...data, loading, type, id };
}
