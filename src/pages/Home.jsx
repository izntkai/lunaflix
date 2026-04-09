import { useEffect, useState } from "react";
import { getTrendingAll, getPopularMovies, getTopRatedMovies, getPopularTV, getMovieInfo, getTvInfo } from "../services/tmdb";
import { Hero } from "../components/home/Hero";
import { MovieRow } from "../components/home/MovieRow";
import { HomeSkeleton } from "../components/home/HomeSkeleton";

export default function Home() {
  const [data, setData] = useState({ trending: [], popularMovies: [], popularTV: [], topRated: [], featured: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, popularMoviesRes, popularTVRes, topRatedRes] = await Promise.all([
          getTrendingAll(),
          getPopularMovies(),
          getPopularTV(),
          getTopRatedMovies(),
        ]);

        const trending = trendingRes.results || [];
        const initialFeatured = trending.length > 0
          ? trending[Math.floor(Math.random() * 10)]
          : null;

        // Fetch detailed featured movie for logo support
        let detailedFeatured = initialFeatured;
        if (initialFeatured) {
          try {
            const type = initialFeatured.media_type || (initialFeatured.name ? "tv" : "movie");
            const fetchFn = type === "movie" ? getMovieInfo : getTvInfo;
            detailedFeatured = await fetchFn(initialFeatured.id);
          } catch (err) {
            console.warn("Failed to fetch detailed featured movie, using initial", err);
          }
        }

        setData({
          trending,
          popularMovies: popularMoviesRes.results || [],
          popularTV: popularTVRes.results || [],
          topRated: topRatedRes.results || [],
          featured: detailedFeatured
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchData();
  }, []);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="overflow-x-hidden mt-8">
      <Hero movie={data.featured} />
      <div className="relative z-10 -mt-4 md:-mt-1 bg-transparent pb-20">
        <MovieRow title="Trending Now" movies={data.trending} />
        <MovieRow title="Popular Movies" movies={data.popularMovies} type="movie" />
        <MovieRow title="Popular TV Shows" movies={data.popularTV} type="tv" />
        <MovieRow title="Top Rated Movies" movies={data.topRated} type="movie" />
      </div>
    </div>
  );
}