import React from "react";
import './MyMovies.css';
import { useNavigate } from "react-router-dom";

const MyMovies = () => {
    const navigate = useNavigate();

    const addNewOnClick = () => {
        navigate({ pathname: "/add" })
    }

    return (
        <div className="MyMovies">
            <h2 className="list__title">MY MOVIES</h2>
            <button onClick={addNewOnClick}>Add new</button>
        </div>
    );

}

export default MyMovies;