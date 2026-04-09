import { Capacitor } from "@capacitor/core";

const IS_DEV = import.meta.env.DEV;
const VITE_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

// In Capacitor mobile, we cannot use relative URLs for the Netlify proxy.
// Change this URL to your actual deployed Netlify production URL.
const PRODUCTION_PROXY = "https://lunaflix.netlify.app/.netlify/functions/tmdb-proxy";

// If in development and we have an API key, use direct TMDB URL.
// If on a native platform (Android/iOS), use the absolute production proxy URL.
// Otherwise, use the relative Netlify proxy for web production/dev.
export const BASE_URL = (IS_DEV && VITE_API_KEY) 
  ? "https://api.themoviedb.org/3" 
  : Capacitor.isNativePlatform()
    ? PRODUCTION_PROXY
    : "/.netlify/functions/tmdb-proxy";

export const API_KEY = (IS_DEV && VITE_API_KEY) ? VITE_API_KEY : ""; 


export async function fetchMovies(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}${endpoint}?${query}`);

  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

// Get popular movies
export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  if (!res.ok) throw new Error("Failed to fetch popular movies");
  return res.json();
}

// Get top-rated movies
export async function getTopRatedMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  );
  if (!res.ok) throw new Error("Failed to fetch top-rated movies");
  return res.json();
}

// Get trending movies this week
export async function getTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json();
}

// Get movie details + credits
export async function getMovieInfo(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,images&include_image_language=en,null`
  );
  if (!res.ok) throw new Error("Failed to fetch movie info");
  return res.json();
}

// Search movies by query
export async function searchMovies(query) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
  );
  if (!res.ok) throw new Error("Failed to search movies");
  return res.json();
}

// TMDB image base URLs
const IMAGE_BASE = "https://image.tmdb.org/t/p";

// Get poster URL
export function getPosterUrl(path, size = "w300") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "https://via.placeholder.com/300x450?text=No+Image";
}

// Get backdrop URL
export function getBackdropUrl(path, size = "w780") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "https://via.placeholder.com/1280x720?text=No+Backdrop";
}

// Get profile URL (for actors/people)
export function getProfileUrl(path, size = "h632") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "https://via.placeholder.com/300x450?text=No+Profile";
}

// Get Person Details
export const getPersonDetails = async (id) => {
  const res = await fetch(
    `${BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits`
  );
  if (!res.ok) throw new Error("Failed to fetch person details");
  return res.json();
};

// --- TV FUNCTIONS ---
export async function getTrendingAll() {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch trending content");
  return res.json();
}

export async function getPopularTV() {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
  if (!res.ok) throw new Error("Failed to fetch popular TV shows");
  return res.json();
}

export async function getTvInfo(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,images&include_image_language=en,null`);
  if (!res.ok) throw new Error("Failed to fetch TV info");
  return res.json();
}

// Get official Movie Genres
export async function getMovieGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

// Get official TV Genres
export async function getTvGenres() {
  const res = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error("Failed to fetch TV genres");
  return res.json();
}

// Discover Movies with Filters
export async function discoverMovies({ genre, year, language, minRating, runtime, page = 1 }) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: "popularity.desc",
    include_adult: "false",
    include_video: "false",
    page: page.toString(),
    "vote_count.gte": "100"
  });

  if (genre) params.append("with_genres", genre);
  if (year) params.append("primary_release_year", year);
  if (language) params.append("with_original_language", language);

  if (minRating) {
    if (minRating.includes("-")) {
      const [min, max] = minRating.split("-");
      params.append("vote_average.gte", min);
      params.append("vote_average.lte", max);
    } else {
      params.append("vote_average.gte", minRating);
    }
  }

  if (runtime && runtime.includes("-")) {
    const [min, max] = runtime.split("-");
    params.append("with_runtime.gte", min);
    params.append("with_runtime.lte", max);
  }

  const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to discover movies");
  return res.json();
}

// Discover TV Shows (Updated for Status Filter)
export async function discoverTv({ genre, year, language, minRating, status, page = 1 }) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: "popularity.desc",
    include_adult: "false",
    page: page.toString(),
    "vote_count.gte": "10"
  });

  if (genre) params.append("with_genres", genre);
  if (year) params.append("first_air_date_year", year);
  if (language) params.append("with_original_language", language);
  if (status) params.append("with_status", status); // Added Status support

  if (minRating) {
    if (minRating.includes("-")) {
      const [min, max] = minRating.split("-");
      params.append("vote_average.gte", min);
      params.append("vote_average.lte", max);
    } else {
      params.append("vote_average.gte", minRating);
    }
  }

  const res = await fetch(`${BASE_URL}/discover/tv?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to discover TV shows");
  return res.json();
}

export async function searchMulti(query) {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
  );
  if (!res.ok) throw new Error("Failed to search");
  return res.json();
}

// Get videos for a movie or TV show
export async function getVideos(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`Failed to fetch ${type} videos`);
  return res.json();
}

// Get recommendations for a movie or TV show
export async function getRecommendations(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`);
  if (!res.ok) throw new Error(`Failed to fetch ${type} recommendations`);
  return res.json();
}

// Get detailed info for a specific TV episode
export async function getEpisodeInfo(id, season, episode) {
  const res = await fetch(`${BASE_URL}/tv/${id}/season/${season}/episode/${episode}?api_key=${API_KEY}&append_to_response=credits`);
  if (!res.ok) throw new Error("Failed to fetch episode info");
  return res.json();
}