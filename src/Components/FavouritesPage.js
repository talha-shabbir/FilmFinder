import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './FavouritesPage.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(user => user.email === currentUserEmail);

    if (currentUser && currentUser.favorites) {
      setFavorites(currentUser.favorites);
    } else {
      setFavorites([]);
    }
  }, []);

  if (favorites.length === 0) {
    return <p className="no-favorites">No favorite movies yet!</p>;
  }

  return (
    <div className="favorites-page">
      <h2>Your Favorite Movies</h2>
      <div className="movies-grid">
        {favorites.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
