const API_KEY = "9f6076fcc8d60ea3d15d26eda84a5730"; // replace with your TMDB key
const BASE_URL = "https://api.themoviedb.org/3";

// Get popular movies
export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  if (!res.ok) throw new Error("Failed to fetch popular movies");
  return res.json();
}

// Get top-rated movies (critically acclaimed)
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
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
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

export const getPersonDetails = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits`
  );
  return res.json();
};

// --- TV FUNCTIONS ---
export async function getTrendingAll() {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
  return res.json();
}

export async function getPopularTV() {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
  return res.json();
}

export async function getTvInfo(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
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
export async function discoverMovies({ genre, year, language, minRating, page = 1 }) {
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
  
  // Logic to handle Ranges (1-3) vs Minimums (7+)
  if (minRating) {
    if (minRating.includes("-")) {
      const [min, max] = minRating.split("-");
      params.append("vote_average.gte", min);
      params.append("vote_average.lte", max);
    } else {
      params.append("vote_average.gte", minRating);
    }
  }

  const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to discover movies");
  return res.json();
}

// Discover TV Shows with Filters
export async function discoverTv({ genre, year, language, minRating, page = 1 }) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: "popularity.desc",
    include_adult: "false",
    page: page.toString(),
    "vote_count.gte": "100"
  });

  if (genre) params.append("with_genres", genre);
  if (year) params.append("first_air_date_year", year);
  if (language) params.append("with_original_language", language);
  
  // Logic to handle Ranges (1-3) vs Minimums (7+)
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

// Add this new function
export async function searchMulti(query) {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
  );
  if (!res.ok) throw new Error("Failed to search");
  return res.json();
}