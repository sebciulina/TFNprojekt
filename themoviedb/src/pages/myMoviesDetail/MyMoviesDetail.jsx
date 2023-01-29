import React, { useEffect, useState } from "react";
import "./MyMoviesDetail.scss";
import "../movieDetail/Movie.scss";
import axios from 'axios';
import { useParams } from "react-router-dom";
import ReactPlayer from 'react-player/youtube';
import { Rating } from 'react-simple-star-rating'
import { AiOutlineCheck } from 'react-icons/ai';


const MyMoviesDetail = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [isVoted, setIsVoted] = useState(false);
    const [comment, setComment] = useState("");
    const [commentState, setCommentSate] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/movies/${id}`)
            .then(response => {
                setMovie(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, isVoted, commentState])

    const handleVote = async (vote) => {
        vote = vote * 2;
        if (isVoted === false) {
            const body = JSON.stringify({ vote });
            const headers = { "Content-Type": "application/json" };
            const voteRes = await fetch(
                `http://localhost:5000/movies/vote/${id}`,
                {
                    method: "PATCH",
                    body,
                    headers,
                }
            );
            const voteData = await voteRes.json();
            console.log(voteData);
            if (voteData.message === 'Vote added successfully') {
                setIsVoted(true);
            }
            else {
                setIsVoted(false);
            }
        }

    }

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    }

    const handleAddComment = () => {
        if(!comment){
            setErrorMessage("Comment can't be empty!");
            return;
        }
        fetch(`http://localhost:5000/movies/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: comment })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Comment added successfully') {
                    setCommentSate(!commentState);
                }
            })
            .catch(err => console.log(err));
        setComment("");
        setErrorMessage("");
    }


    return (
        <div className="movie">
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" alt={currentMovieDetail ? currentMovieDetail.title : ""} src={currentMovieDetail ? currentMovieDetail.picture : ""} onError={e => e.currentTarget.src = "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg"} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.title : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? Math.round(((currentMovieDetail.vote / currentMovieDetail.voteCount) + Number.EPSILON) * 100) / 100 : ""} <i className="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.voteCount + ") votes" : ""}</span>
                            <div className="star__rating">
                                <Rating
                                    onClick={handleVote}
                                    allowFraction={true}
                                />
                                {isVoted ? (<AiOutlineCheck className="checkMark" />) : null}
                            </div>
                        </div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.releaseDate : ""}</div>
                        <div className="movie__director">{currentMovieDetail ? "Director: " + currentMovieDetail.director : ""}</div>
                        <div className="movie__genres">
                            {
                                currentMovieDetail && currentMovieDetail.genres
                                    ?
                                    currentMovieDetail.genres.map((genre, index) => (
                                        <><span className="movie__genre" key={index}>{genre}</span></>
                                    ))
                                    :
                                    ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Description</div>
                        <div>{currentMovieDetail ? currentMovieDetail.description : ""}</div>
                    </div>

                </div>
            </div>


            <div className="movie__cast">
                <div className="movie__heading">Cast</div>
                {
                    currentMovieDetail && currentMovieDetail.cast &&
                    currentMovieDetail.cast
                        .map((actor, index) => (
                            <>
                                {
                                    <div className="actorImage" key={index}>
                                        <p>{actor}</p>
                                    </div>
                                }
                            </>
                        ))
                }

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

            <div className="movie__comments">
                <div className="movie__heading">Comments</div>
                <div className="add__comment">
                    <textarea rows="10" cols="30" placeholder="Add a comment" onChange={handleCommentChange} value={comment} required></textarea>
                    <button onClick={handleAddComment}>Add</button>
                    <div className="error__message">
                        {errorMessage ? errorMessage : null}
                    </div>
                </div>
                {
                    currentMovieDetail && currentMovieDetail.comments &&
                    currentMovieDetail.comments.map((comment, index) => (
                        <>
                            {
                                <div className="comment" key={index}>
                                    <p>{comment}</p>
                                </div>
                            }
                        </>
                    ))
                }
            </div>
        </div>
    );
}

export default MyMoviesDetail;