import React, { useEffect, useState } from "react";
import "./movieList.css";
import { useLocation, useParams } from "react-router-dom";
import Cards from "../card/card";

const API = process.env.REACT_APP_API_KEY;

const MovieList = () => {
    const [movieList, setMovieList] = useState([]);
    const [search, setSearch] = useState(false);
    const { type } = useParams();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get("query");
        if (searchTerm) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${searchTerm}`)
                .then((res) => res.json())
                .then((data) => setMovieList(data.results));
            setSearch(true);
        } else {
            const getData = () => {
                fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=${API}&language=en-US`)
                    .then((res) => res.json())
                    .then((data) => setMovieList(data.results));
            };
            getData();
            setSearch(false);
        }
    }, [location, type]);



    return (
        <div className="movie__list">
            <h2 className="list__title">{search ? `SEARCH RESULTS` : (type ? type : "POPULAR").toUpperCase()}</h2>
            <div className="list__cards">
                {movieList.map((movie, index) => (
                    <Cards movie={movie} key={index} />
                ))}
            </div>
        </div>
    );
};

export default MovieList;