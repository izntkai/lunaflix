import { useEffect, useMemo, useState } from "react";
import {
  discoverMovies,
  getMovieInfo,
  getPopularMovies,
  getPopularTV,
  getRecommendations,
  getTopRatedMovies,
  getTrendingAll,
} from "../services/tmdb";
import { Hero } from "../components/home/Hero";
import { MovieRow } from "../components/home/MovieRow";
import { HomeSkeleton } from "../components/home/HomeSkeleton";
import { useMediaLibrary } from "../hooks/useMediaLibrary";

export default function Home() {
  const [data, setData] = useState({
    trending: [],
    popularMovies: [],
    popularTV: [],
    topRated: [],
    featured: null,
    newReleases: [],
    becauseYouWatched: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { continueWatching, myList } = useMediaLibrary();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [trendingRes, popularMoviesRes, popularTVRes, topRatedRes, releasesRes] = await Promise.all([
          getTrendingAll(),
          getPopularMovies(),
          getPopularTV(),
          getTopRatedMovies(),
          discoverMovies({ year: new Date().getFullYear(), page: 1 }),
        ]);

        const trending = trendingRes.results || [];
        const candidate = trending[Math.floor(Math.random() * Math.min(10, trending.length))] || null;
        let detailedFeatured = candidate;

        if (candidate) {
          const type = candidate.media_type || (candidate.name ? "tv" : "movie");
          if (type === "movie") {
            detailedFeatured = await getMovieInfo(candidate.id);
          }
        }

        setData((prev) => ({
          ...prev,
          trending,
          popularMovies: popularMoviesRes.results || [],
          popularTV: popularTVRes.results || [],
          topRated: topRatedRes.results || [],
          newReleases: releasesRes.results || [],
          featured: detailedFeatured,
        }));
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading your feed.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const seed = continueWatching[0];
    if (!seed) return;

    getRecommendations(seed.type || (seed.name ? "tv" : "movie"), seed.id)
      .then((res) => {
        setData((prev) => ({ ...prev, becauseYouWatched: res.results?.slice(0, 14) || [] }));
      })
      .catch(() => {
        setData((prev) => ({ ...prev, becauseYouWatched: [] }));
      });
  }, [continueWatching]);

  const continueProgress = useMemo(
    () =>
      continueWatching.reduce((map, item) => {
        map[`${item.type}:${item.id}`] = item.progress ?? 0;
        return map;
      }, {}),
    [continueWatching],
  );

  if (loading) return <HomeSkeleton />;

  return (
    <div className="pb-16">
      {error ? (
        <div className="mx-4 mt-8 rounded-2xl border border-[#2A2A2F] bg-[#111114] p-6 text-center md:mx-10">
          <p className="text-[#F5F5F5]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg border border-[#2A2A2F] bg-[#18181C] px-4 py-2 text-sm text-[#C4B5FD]"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <Hero movie={data.featured} />
          <div className="mt-6 space-y-1">
            <MovieRow
              title="Continue Watching"
              subtitle="Pick up exactly where you left off"
              movies={continueWatching.slice(0, 18)}
              progressMap={continueProgress}
            />
            <MovieRow title="Trending Now" movies={data.trending} />
            <MovieRow title="New Releases" movies={data.newReleases} type="movie" />
            <MovieRow title="Popular Movies" movies={data.popularMovies} type="movie" />
            <MovieRow title="Popular TV Shows" movies={data.popularTV} type="tv" />
            <MovieRow title="Top Rated" movies={data.topRated} type="movie" />
            <MovieRow title="My List" movies={myList.slice(0, 18)} />
            <MovieRow title="Because You Watched" movies={data.becauseYouWatched} />
          </div>
        </>
      )}
    </div>
  );
}
