// Remove the node-fetch line entirely. 
// Modern Node (18+) has fetch built-in!

export const handler = async (event) => {
    const { path, queryStringParameters } = event;
    
    // 1. Get the TMDB API Key from Netlify Environment Variables
    const API_KEY = process.env.VITE_TMDB_API_KEY;
    const BASE_URL = "https://api.themoviedb.org/3";
  
    // 2. Extract the endpoint
    const endpoint = path.replace("/.netlify/functions/tmdb-proxy", "");
  
    // 3. Reconstruct query parameters
    const params = new URLSearchParams({
      ...queryStringParameters,
      api_key: API_KEY, // The proxy forces your secret key here
    }).toString();
  
    try {
      // Just use the native fetch!
      const response = await fetch(`${BASE_URL}${endpoint}?${params}`);
      const data = await response.json();
  
      return {
        statusCode: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed fetching data from TMDB" }),
      };
    }
  };