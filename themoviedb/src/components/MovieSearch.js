import React, { useState } from 'react';
import axios from 'axios';
const api = process.env.REACT_APP_API_KEY;

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = event => {
        const searchTerm = event.target.value;
        axios
            .get(`https://api.themoviedb.org/3/search/movie?api_key=${api}&query=${searchTerm}`)
            .then(res => {
                const movies = res.data.results;
                setMovies(movies);
            })
            .catch(error => {
                setError(error);
            });
    };

    return (
        <div>
            <input type="text" onChange={handleSearch} placeholder="Wpisz tytuł filmu" />
            {error && <p>{error.message}</p>}
            <ul>
                {movies.map(movie => (
                    <li key={movie.id}>{movie.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default MovieSearch;