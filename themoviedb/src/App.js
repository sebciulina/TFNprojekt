import './App.css';
import MovieSearch from './components/MovieSearch';
import PopularMovies from './components/PopularMovies';

function App() {
  return (
    <div className="App">
      <MovieSearch />
      <PopularMovies />
    </div>
  );
}

export default App;
