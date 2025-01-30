import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Components/Registration";
import Login from "./Components/Login";
import Home from "./Components/Home";
import MovieDetails from "./Components/MovieDetails";
import FavoritesPage from "./Components/FavouritesPage"; // Import the FavoritesPage component

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Registration Page */}
        <Route path="/register" element={<Register />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Home Page */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />

        {/* Movie Details Page */}
        <Route
          path="/movie/:id"
          element={isAuthenticated ? <MovieDetails /> : <Navigate to="/login" />}
        />

        {/* Favourites Page */}
        <Route
          path="/favourites"
          element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />}
        />

        {/* Redirect Unmatched Routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/home" : "/register"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
