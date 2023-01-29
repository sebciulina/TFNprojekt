import React, { useEffect, useState } from "react";
import "./movieList.scss";
import { useLocation, useParams } from "react-router-dom";
import Cards from "../card/card";

const API = process.env.REACT_APP_API_KEY;

const MovieList = () => {
    const [movieList, setMovieList] = useState([]);
    const [originalMovieList, setOriginalMovieList] = useState([]);
    const [search, setSearch] = useState(false);
    const { type } = useParams();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get("query");
        const selectedGenre = searchParams.get("genre");
        if (searchTerm) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${searchTerm}`)
                .then((res) => res.json())
                .then((data) => {
                    if (selectedGenre) {
                        let results = data.results;
                        results = results.filter(
                            (result) => result.genre_ids.includes(parseInt(selectedGenre))
                        );
                        setMovieList(results);
                        setOriginalMovieList(results);
                    } else {
                        setMovieList(data.results);
                        setOriginalMovieList(data.results);
                    }
                });
            setSearch(true);
        } else {
            const getData = () => {
                fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=${API}&language=en-US`)
                    .then((res) => res.json())
                    .then((data) => {
                        setMovieList(data.results);
                        setOriginalMovieList(data.results);
                    });
            };
            getData();
            setSearch(false);
        }
    }, [location, type]);

    const handleSort = (event) => {
        let sortType = event.target.value;
        let sortedMovies = [...movieList];
        if (sortType === "release_date") {
            sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        } else if (sortType === "original_title") {
            sortedMovies.sort((a, b) => a.original_title.localeCompare(b.original_title));
        } else if (sortType === "vote_average") {
            sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        } else if (sortType === "vote_count") {
            sortedMovies.sort((a, b) => b.vote_count - a.vote_count);
        }
        else if (sortType === "default") {
            sortedMovies = [...originalMovieList];
        }
        setMovieList(sortedMovies);
    };

    return (
        <div className="movie__list">
            <h2 className="list__title">{search ? `SEARCH RESULTS` : (type ? type : "POPULAR").toUpperCase()}</h2>
            <div className="sort__container">
                <label>Sort by: 
                    <select onChange={handleSort}>
                        <option value="default">Default</option>
                        <option value="original_title">Title</option>
                        <option value="release_date">Release Date</option>
                        <option value="vote_average">Rating</option>
                        <option value="vote_count">Popularity</option>
                    </select>
                </label>
            </div>
            <div className="list__cards">
                {movieList.map((movie, index) => (
                    <Cards movie={movie} key={index} />
                ))}
            </div>
        </div>
    );
};

export default MovieList;