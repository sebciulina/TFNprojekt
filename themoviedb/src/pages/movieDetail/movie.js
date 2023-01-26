import React, { useEffect, useState } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import ReactPlayer from 'react-player/youtube';

const API = process.env.REACT_APP_API_KEY;

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [showAllActors, setShowAllActors] = useState(false);
    const { id } = useParams();

    useEffect(() => {

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API}&language=en-US`)
            .then(res => res.json())
            .then(data => setMovie(data))
    }

    const getDirector = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API}`)
            .then(res => res.json())
            .then(data => {
                const director = data.crew.find(member => member.job === 'Director');
                if (director) {
                    setMovie(prevMovie => {
                        return {
                            ...prevMovie,
                            director: director.name
                        }
                    });
                } else {
                    setMovie(prevMovie => {
                        return {
                            ...prevMovie,
                            director: 'Director not found'
                        }
                    });
                }
            });
    }

    const getCrew = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API}`);
            const data = await res.json();
            setMovie(prevMovie => {
                return {
                    ...prevMovie,
                    cast: data.cast
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
    
    const getTrailer = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API}&language=en-US`);
            const data = await res.json();
            const trailer = data.results.filter(result => result.type === "Trailer").map(result => `https://www.youtube.com/watch?v=${result.key}`)[0];
            setMovie(prevMovie => {
                return {
                    ...prevMovie,
                    trailer
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
    
    const getGallery = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API}`);
            const data = await res.json();
            setMovie(prevMovie => {
                return {
                    ...prevMovie,
                    gallery: data.backdrops
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

        getData();
        getDirector();
        getCrew();
        getGallery();
        getTrailer();
        window.scrollTo(0, 0);
    }, [id])



    return (
        <div className="movie">
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" alt={currentMovieDetail ? currentMovieDetail.original_title : ""} src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average : ""} <i className="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>
                        <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__director">{currentMovieDetail ? "Director: " + currentMovieDetail.director : ""}</div>
                        <div className="movie__genres">
                            {
                                currentMovieDetail && currentMovieDetail.genres
                                    ?
                                    currentMovieDetail.genres.map((genre, index) => (
                                        <><span className="movie__genre" key={index} id={genre.id}>{genre.name}</span></>
                                    ))
                                    :
                                    ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="movie__links">
                            {
                                currentMovieDetail && currentMovieDetail.id && <a href={`https://www.themoviedb.org/movie/${id}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><p><span className="movie__homeButton movie__Button">Homepage <i className="newTab fas fa-external-link-alt"></i></span></p></a>
                            }
                        </div>
                        <div className="synopsisText">Description</div>
                        <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>

                </div>
            </div>


            <div className="movie__cast">
                <div className="movie__heading">Cast</div>
                {
                    currentMovieDetail && currentMovieDetail.cast &&
                    currentMovieDetail.cast
                        .slice(0, showAllActors ? currentMovieDetail.cast.length : 8)
                        .map((actor, index) => (
                            <>
                                {
                                    actor.profile_path &&
                                    <div className="actorImage" key={index}>
                                        <img className="movie__actor" alt={actor.name} src={`https://image.tmdb.org/t/p/original${actor.profile_path}`} />
                                        <p>{actor.name}</p>
                                    </div>
                                }
                            </>
                        ))
                }
                <br></br>
                {
                    currentMovieDetail && currentMovieDetail.cast && currentMovieDetail.cast.length > 8 &&
                    <button className="showAllActorsButton" onClick={() => setShowAllActors(!showAllActors)}>
                        {showAllActors ? "Show less" : "Show more"}
                    </button>
                }
            </div>

            <div className="movie__gallery">
                <div className="movie__heading">Gallery</div>
                <div className="movie__images">
                    {currentMovieDetail && currentMovieDetail.gallery && (
                        <Carousel>
                            {currentMovieDetail.gallery.map((image, index) => (
                                <img key={index} src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={image.file_path} />
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>
            <div className="movie__trailer">
                <div className="movie__heading">Trailer</div>
                <div className="movie__player">
                    {
                        currentMovieDetail && currentMovieDetail.trailer && (
                            <ReactPlayer url={currentMovieDetail.trailer} controls />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Movie