import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchMovie.css";

const API = process.env.REACT_APP_API_KEY;

const SearchMovie = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${searchTerm}`)
                .then((res) => res.json())
                .then((data) => setSearchResults(data.results));
        }
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest('.searchResults')) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowResults]);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate({
            pathname: "/search",
            search: `?query=${searchTerm}`,
        });
    };

    return (
        <form className="searchMovie" onSubmit={handleSubmit}>
            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={() => setShowResults(true)}
                ></input>
                <button>Search</button>
                {searchTerm && showResults && (
                    <div className={`searchResults ${showResults ? 'show' : ''}`}>
                        {searchResults.map((result) => (
                            <div
                                className="result"
                                key={result.id}
                                onClick={() => {
                                    navigate(`/movie/${result.id}`);
                                    setShowResults(false);
                                }}
                            >
                                <img src={`https://image.tmdb.org/t/p/w300${result.poster_path}`} alt={result.original_title} />
                                <span>{result.original_title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </form>
    );
    
};


export default SearchMovie;
