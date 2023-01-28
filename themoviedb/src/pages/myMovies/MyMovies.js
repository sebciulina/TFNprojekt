import React, { useEffect, useState } from "react";
import './MyMovies.css';
import { useNavigate } from "react-router-dom";
import MyMoviesCard from "../../components/myMoviesCard/MyMoviesCard";

const MyMovies = () => {
    const [movieList, setMovieList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:5000/movies');
                const data = await response.json();
                setMovieList(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchMovies();
    }, [])


    const addNewOnClick = () => {
        navigate({ pathname: "/add" })
    }

    return (
        <div className="MyMovies">
            <h2 className="list__title">MY MOVIES</h2>
            <div className="add__button">
                <button onClick={addNewOnClick}>Add new</button>
            </div>
            <div className="list__cards">
                {movieList.map((movie, index) => (
                    <MyMoviesCard movie={movie} key={index} />
                ))}
            </div>
        </div>
    );

}

export default MyMovies;