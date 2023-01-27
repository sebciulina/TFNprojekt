import React, { useEffect, useState } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import ReactPlayer from 'react-player/youtube';
import { Rating } from 'react-simple-star-rating'
import { AiOutlineCheck } from 'react-icons/ai';

const API = process.env.REACT_APP_API_KEY;

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [showAllActors, setShowAllActors] = useState(false);
    const [guestId, setGuestId] = useState();
    const [isVoted, setIsVoted] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API}&append_to_response=credits,videos,images`);
                const data = await res.json();
                setMovie(data);

                getDirector(data);
                getCrew(data);
                getTrailer(data);
                getGallery(data);
            } catch (err) {
                console.log(err);
            }
        }
        handleSession();
        getData();
        window.scrollTo(0, 0);
    }, [id])

    const getDirector = (data) => {
        const director = data.credits.crew.find(member => member.job === 'Director');
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
    }
    
    const getCrew = (data) => {
        setMovie(prevMovie => {
            return {
                ...prevMovie,
                cast: data.credits.cast
            }
        });
    }
    
    const getTrailer = (data) => {
        const trailer = data.videos.results.filter(result => result.type === "Trailer").map(result => `https://www.youtube.com/watch?v=${result.key}`)[0];
        setMovie(prevMovie => {
            return {
                ...prevMovie,
                trailer
            }
        });
    }
    
    const getGallery = (data) => {
        setMovie(prevMovie => {
            return {
                ...prevMovie,
                gallery: data.images.backdrops
            }
        });
    }

    const handleSession = async () => {
        const guestRes = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API}`);
        const guestData = await guestRes.json();
        const guest_session_id = guestData.guest_session_id;

        setGuestId(guest_session_id);
    }

    const handleRating = async (rate) => {
        const body = JSON.stringify({ value: rate * 2 });
        const headers = { "Content-Type": "application/json" };
        const ratingRes = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${API}&guest_session_id=${guestId}`,
            {
                method: "POST",
                body,
                headers,
            }
        );
        const ratingData = await ratingRes.json();
        console.log(ratingData);
        if(ratingData.status_message === 'Success.'){
            setIsVoted(true);
        }
        else{
            setIsVoted(false);
        }
    }

    return (
        <div className="movie">
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" alt={currentMovieDetail ? currentMovieDetail.original_title : ""} src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} onError={e => e.currentTarget.src = "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg"} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average : ""} <i className="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                            <div className="star__rating">
                                <Rating
                                    onClick={handleRating}
                                    allowFraction={true}
                                />
                                {isVoted ? (<AiOutlineCheck className="checkMark"/>) : null}
                            </div>
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