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

// Get poster URL (sizes: w200, w300, w500, w780, original)
export function getPosterUrl(path, size = "w300") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "https://via.placeholder.com/300x450?text=No+Image";
}

// Get backdrop URL (sizes: w300, w780, w1280, original)
export function getBackdropUrl(path, size = "w780") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "https://via.placeholder.com/1280x720?text=No+Backdrop";
}

export const getPersonDetails = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits`
  );
  return res.json();
};

// --- ADDED TV FUNCTIONS ---
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



