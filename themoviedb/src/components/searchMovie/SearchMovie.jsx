import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchMovie.scss";

const API = process.env.REACT_APP_API_KEY;

const SearchMovie = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API}&query=${searchTerm}`)
                .then((res) => res.json())
                .then((data) => {
                    let results = data.results;
                    if (selectedGenre !== "") {
                        results = results.filter(
                            (result) => result.genre_ids.includes(parseInt(selectedGenre))
                        );
                        setSearchResults(results);
                    }
                    else{
                       setSearchResults(results); 
                    }
                    
                });
        }
    }, [searchTerm, selectedGenre]);

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

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API}&language=en-US`)
            .then((res) => res.json())
            .then((data) => setGenres(data.genres));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedGenre !== "") {
            navigate({
                pathname: "/search",
                search: `?query=${searchTerm}&genre=${selectedGenre}`,
            });
        }
        else {
            navigate({
                pathname: "/search",
                search: `?query=${searchTerm}`,
            });
        }

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
                <select onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
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
                                <img src={`https://image.tmdb.org/t/p/w300${result.poster_path}`} alt={result.original_title} onError={e => e.currentTarget.src = "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg"} />
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
