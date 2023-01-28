import React, {useEffect, useState} from "react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "../card/card.css"
import { Link } from "react-router-dom"

const MyMoviesCard = ({movie}) => {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }, []) 

    return <>
    {
        isLoading
        ?
        <div className="cards">
            <SkeletonTheme color="#202020" highlightColor="#444">
                <Skeleton height={300} duration={2} />
            </SkeletonTheme>
        </div>
        :
        <Link to={`/mymovies/${movie._id}`} style={{textDecoration:"none", color:"white"}}>
            <div className="cards">
                <img className="cards__img" alt={movie ? movie.title : ""} src={movie ? movie.picture : ""} onError={e => e.currentTarget.src = "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg"} />
                <div className="cards__overlay">
                    <div className="card__title">{movie ? movie.title : ""}</div>
                    <div className="card__runtime">
                        {movie ? movie.releaseDate : ""}
                        <span className="card__rating">{movie ? Math.round(((movie.vote/movie.voteCount) + Number.EPSILON) * 100) / 100 : ""}<i className="fas fa-star" /></span>
                    </div>
                    <div className="card__description">{movie ? movie.description.slice(0,118)+"..." : ""}</div>
                </div>
            </div>
        </Link>
    }
    </>
}

export default MyMoviesCard;