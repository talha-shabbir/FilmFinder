import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams(); // Retrieve movie ID from URL
  const navigate = useNavigate(); // For navigation
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=433d782400169516224391db5673c6ee`
        );
        const data = await response.json();
        setMovie(data);
        setLoading(false);

        // Check if this movie is already a favorite for the logged-in user
        const currentUserEmail = localStorage.getItem("currentUserEmail");
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = storedUsers.find(user => user.email === currentUserEmail);

        if (currentUser) {
          const isFav = currentUser.favorites?.some(favMovie => favMovie.id === data.id);
          setIsFavorite(isFav);
        }
      } catch (err) {
        setError("Error fetching movie details.");
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  const toggleFavorite = () => {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    if (!currentUserEmail || !movie) {
      alert("No user logged in or movie data is missing.");
      return;
    }
  
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserIndex = storedUsers.findIndex(user => user.email === currentUserEmail);
  
    if (currentUserIndex !== -1) {
      const currentUser = storedUsers[currentUserIndex];
      const currentFavorites = currentUser.favorites || [];
      let updatedFavorites;
  
      if (isFavorite) {
        updatedFavorites = currentFavorites.filter(favMovie => favMovie.id !== movie.id);
      } else {
        const newFavorite = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        };
        updatedFavorites = [...currentFavorites, newFavorite];
      }
  
      currentUser.favorites = updatedFavorites;
      storedUsers[currentUserIndex] = currentUser;
      localStorage.setItem("users", JSON.stringify(storedUsers));
      setIsFavorite(!isFavorite); // Toggle and re-render
    } else {
      alert("User not found in the database.");
    }
  };
  
  

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="movie-details-page">
      <div className="movie-details-header">
        <img
          className="movie-details-poster"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-details-info">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-tagline">{movie.tagline}</p>
          <p className="movie-rating">⭐ {movie.vote_average}/10</p>
          <p className="movie-overview">{movie.overview}</p>

          {/* Add to favorites button */}
          <button className={`favorite-button ${isFavorite ? 'favorited' : ''}`} onClick={toggleFavorite}>
            {isFavorite ? '❤️ Added to Favorites' : '♡ Add to Favorites'}
          </button>
        </div>
      </div>
      <div className="additional-details">
        <h3>Additional Details</h3>
        <div className="detail-item">Release Date: {movie.release_date}</div>
        <div className="detail-item">Runtime: {movie.runtime} mins</div>
        <div className="detail-item">Language: {movie.original_language}</div>
        <div className="detail-item">Genres: {movie.genres.map(genre => genre.name).join(", ")}</div>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default MovieDetails;
