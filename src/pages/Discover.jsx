import { useEffect, useState } from "react";
import { API_KEY, fetchMovies, getPopularMovies, getPopularTV, getTopRatedMovies, getTrendingAll } from "../services/tmdb";
import { Loader2 } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { MovieRow } from "../components/home/MovieRow";

function withApi(params = {}) {
  return API_KEY ? { ...params, api_key: API_KEY } : params;
}

export default function Discover() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState({
    trending: [],
    popularMovies: [],
    topRated: [],
    upcoming: [],
    nowPlaying: [],
    popularTv: [],
    airingToday: [],
  });

  useEffect(() => {
    Promise.all([
      getTrendingAll(),
      getPopularMovies(),
      getTopRatedMovies(),
      fetchMovies("/movie/upcoming", withApi({ language: "en-US", page: 1 })),
      fetchMovies("/movie/now_playing", withApi({ language: "en-US", page: 1 })),
      getPopularTV(),
      fetchMovies("/tv/airing_today", withApi({ language: "en-US", page: 1 })),
    ])
      .then(([trending, popularMovies, topRated, upcoming, nowPlaying, popularTv, airingToday]) => {
        setSections({
          trending: trending.results || [],
          popularMovies: popularMovies.results || [],
          topRated: topRated.results || [],
          upcoming: upcoming.results || [],
          nowPlaying: nowPlaying.results || [],
          popularTv: popularTv.results || [],
          airingToday: airingToday.results || [],
        });
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#A78BFA]" />
      </div>
    );
  }

  return (
    <div className="pb-16 pt-6">
      <div className="px-4 md:px-8">
        <SectionHeader
          eyebrow="Discover"
          title="Find Your Next Favorite"
          description="Explore trending, popular, top-rated, upcoming, and currently airing picks in one streamlined hub."
        />
      </div>
      <MovieRow title="Trending" movies={sections.trending} />
      <MovieRow title="Popular Movies" movies={sections.popularMovies} type="movie" />
      <MovieRow title="Top Rated Movies" movies={sections.topRated} type="movie" />
      <MovieRow title="Upcoming Movies" movies={sections.upcoming} type="movie" />
      <MovieRow title="Now Playing" movies={sections.nowPlaying} type="movie" />
      <MovieRow title="Popular TV" movies={sections.popularTv} type="tv" />
      <MovieRow title="Airing Today" movies={sections.airingToday} type="tv" />
    </div>
  );
}
