import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from './components/header/Header';
import Home from './pages/home/Home';
import MovieList from './components/movieList/MovieList';
import Movie from './pages/movieDetail/Movie';
import MyMovies from './pages/myMovies/MyMovies';
import AddMovieForm from './pages/addMovieForm/AddMovieForm';
import MyMoviesDetail from './pages/myMoviesDetail/MyMoviesDetail';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="movie/:id" element={<Movie />}></Route>
          <Route path="movies/:type" element={<MovieList />}></Route>
          <Route path="search" element={<MovieList />}></Route>
          <Route path="mymovies" element={<MyMovies />}></Route>
          <Route path="mymovies/:id" element={<MyMoviesDetail />}></Route>
          <Route path="add" element={<AddMovieForm />}></Route>
          <Route path="/*" element={<h1>Error Page</h1>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
