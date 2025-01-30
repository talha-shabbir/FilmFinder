import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/login");
  };

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/trending/movie/day?api_key=433d782400169516224391db5673c6ee"
        );
        const data = await response.json();
        setTrendingMovies(data.results);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };
    fetchTrendingMovies();
  }, []);

  const fetchMovies = async (query) => {
    if (!query) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=433d782400169516224391db5673c6ee&query=${query}`
      );
      const data = await response.json();
      setMovies(data.results);
      setLoading(false);
    } catch (error) {
      setError("Error fetching movies.");
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
    fetchMovies(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-dropdown")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>FilmFinder</h1>
      </header>

      <nav className="home-nav">
        <button onClick={handleLogout} className="nav-button logout-button">
          Logout
        </button>
        <Link className="fav" to='/favourites' >Favourites</Link>
      </nav>
    <br></br>
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="search-input"
        />
      </form>

      {showDropdown && (
  <div className="search-dropdown">
    {loading && <p className="loading-message">Loading...</p>}
    {error && <p className="error-message">{error}</p>}
    {movies.length > 0 ? (
      <ul className="dropdown-list">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="dropdown-item"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                : "/placeholder-image.png"}
              alt={`${movie.title} Poster`}
              className="dropdown-poster"
            />
            <div className="dropdown-details">
              <span
                className="dropdown-title"
                dangerouslySetInnerHTML={{
                  __html: movie.title.replace(
                    new RegExp(`(${searchQuery})`, "gi"),
                    (match) => `<span class="highlight">${match}</span>`
                  ),
                }}
              ></span>
              <p className="dropdown-overview">
                {movie.overview || "No description available"}
              </p>
              <span className="dropdown-rating">
                Rating: {movie.vote_average}/10
              </span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="no-results-message">No results found.</p>
    )}
  </div>
)}


      <main className="home-main">
        <h2>Trending Movies</h2>
        <div className="movies-grid">
          {trendingMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
