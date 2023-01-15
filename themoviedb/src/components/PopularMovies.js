import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube'
const api = process.env.REACT_APP_API_KEY;

const PopularMovies = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState({});
    const [showTrailer, setShowTrailer] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`https://api.themoviedb.org/3/movie/popular?api_key=${api}`)
            .then(res => {
                const movies = res.data.results;
                setMovies(movies);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api}`)
            .then(res => {
                const genresList = res.data.genres;
                const genresObj = genresList.reduce((acc, genre) => {
                    acc[genre.id] = genre.name;
                    return acc;
                }, {});
                setGenres(genresObj);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    useEffect(() => {
        movies.forEach(movie => {
            axios
                .get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${api}`)
                .then(res => {
                    const director = res.data.crew.find(member => member.job === 'Director');
                    if (director) {
                        movie.director = director.name;
                        setMovies([...movies]);
                    } else {
                        movie.director = 'Director not found';
                        setMovies([...movies]);
                    }
                })
                .catch(error => {
                    setError(error);
                });
        });
    }, [movies]);

    useEffect(() => {
        const updatedMovies = movies.map(movie => {
            return axios
                .get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${api}`)
                .then(res => {
                    if (res.data.cast && res.data.cast.length > 0) {
                        movie.cast = res.data.cast.map(actor => actor.name);
                    }
                    return movie;
                })
                .catch(error => {
                    setError(error);
                    return movie;
                });
        });

        Promise.all(updatedMovies).then(movies => setMovies(movies));
    }, [movies]);

    useEffect(() => {
        const fetchTrailer = async (movieId) => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${api}`);
                const trailer = res.data.results.find((result) => result.type === 'Trailer');
                if (trailer) {
                    return `https://www.youtube.com/watch?v=${trailer.key}`;
                }
                return null;
            } catch (error) {
                setError(error);
            }
        };
        const updatedMovies = movies.map(async (movie) => {
            movie.trailerLink = await fetchTrailer(movie.id);
            return movie;
        });
        Promise.all(updatedMovies).then((movies) => setMovies(movies));
    }, [movies]);

    const onClickTrailer = () => {
        if (showTrailer) {
            setShowTrailer(false);
        }
        else {
            setShowTrailer(true);
        }
    }
        

    if (!movies.length) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {error && <p>{error.message}</p>}
            <ul>
                {movies.map(movie => (
                    <li key={movie.id}>
                        <img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt={movie.title} />
                        <h2>{movie.title}</h2>
                        <p>{movie.overview}</p>
                        <span>Data premiery: {movie.release_date}</span><br></br>
                        <span>Gatunki: {movie.genre_ids.map(genreId => genres[genreId]).join(', ')}</span><br></br>
                        <span>Reżyser: {movie.director}</span><br></br>
                        <span>Obsada: {movie.cast && movie.cast.join(', ')}</span><br></br>
                        <a href={`https://www.themoviedb.org/movie/${movie.id}`}>Strona filmu</a><br></br>
                        <span>Średnia ocena: {movie.vote_average} ({movie.vote_count} głosów)</span><br></br>
                        <button>Galeria</button>
                        <button onClick={onClickTrailer}>Trailer</button>
                        {showTrailer ? <ReactPlayer url={movie.trailerLink} controls/> : null}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopularMovies;
