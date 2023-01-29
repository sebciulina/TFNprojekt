import React from "react";
import { useNavigate } from "react-router-dom";
import './AddMovieForm.scss';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

const AddMovieForm = () => {
    const navigate = useNavigate();

    return(
        <div className="AddMovieForm">
            <Formik
                initialValues={{
                    title: '',
                    picture: '',
                    description: '',
                    releaseDate: '',
                    genres: '',
                    director: '',
                    cast: '',
                    trailer: '',
                }}
                onSubmit={(values, {setSubmitting}) => {
                    const genresArray = values.genres.split(',');
                    const castArray = values.cast.split(',');

                    const newMovie = {
                        ...values,
                        genres: genresArray,
                        cast: castArray,
                        vote: 0,
                        voteCount: 0,
                    }

                    axios.post('http://localhost:5000/movies', newMovie)
                        .then(response => {
                            console.log(response);
                            navigate("/mymovies");
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field type="text" name="title" placeholder="Movie Title" />
                        <Field type="text" name="picture" placeholder="Link to Picture" />
                        <Field type="text" name="description" placeholder="Description" />
                        <Field type="date" name="releaseDate" placeholder="Release Date" />
                        <Field type="text" name="genres" placeholder="Genres (comma separated)" />
                        <Field type="text" name="director" placeholder="Director" />
                        <Field type="text" name="cast" placeholder="Cast Actors (comma separated)" />
                        <Field type="text" name="trailer" placeholder="Link to Trailer" />
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddMovieForm;
