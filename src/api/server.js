import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const movies = [
  {
    id: 27205,
    title: "Inception",
    embedUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
  },
  {
    id: 157336,
    title: "Interstellar",
    embedUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
  },
  {
    id: 238,
    title: "The Godfather",
    embedUrl: "https://www.youtube.com/embed/sY1S34973zA",
  },
];

// Get all movies
app.get("/api/movies", (req, res) => {
  res.json(movies);
});

// Get movie by ID
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json(movie);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
