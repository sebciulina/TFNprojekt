import React from "react"
import "./Header.scss"
import { Link } from "react-router-dom"
import SearchMovie from "../searchMovie/SearchMovie"

const Header = () => {
    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/" style={{ textDecoration: "none" }}><span>Home</span></Link>
                <Link to="/movies/popular" style={{ textDecoration: "none" }}><span>Popular</span></Link>
                <Link to="/movies/top_rated" style={{ textDecoration: "none" }}><span>Top Rated</span></Link>
                <Link to="/movies/upcoming" style={{ textDecoration: "none" }}><span>Upcoming</span></Link>
                <Link to="/mymovies" style={{ textDecoration: "none" }}><span>My Movies</span></Link>
            </div>
            <div className="headerRight">
                <SearchMovie></SearchMovie>
            </div>
        </div>
    )
}

export default Header