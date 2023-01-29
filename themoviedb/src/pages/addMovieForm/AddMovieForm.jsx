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
                validate={values => {
                    const errors = {};
                    if (!values.title) {
                        errors.title = 'Title is required';
                    }
                    if (!values.picture) {
                        errors.picture = 'Picture URL is required';
                    }
                    if (!values.description) {
                        errors.description = 'Description is required';
                    }
                    if (!values.releaseDate) {
                        errors.releaseDate = 'Release Date is required';
                    }
                    if (!values.genres) {
                        errors.genres = 'Genres are required';
                    }
                    if (!values.director) {
                        errors.director = 'Director is required';
                    }
                    if (!values.cast) {
                        errors.cast = 'Cast is required';
                    }
                    if (!values.trailer) {
                        errors.trailer = 'Trailer URL is required';
                    }
                    else if (!values.trailer.startsWith("https://www.youtube.com")) {
                        errors.trailer = 'Trailer must be a valid YouTube link';
                    }
                    return errors;
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
                {({ isSubmitting, errors, touched }) => (
                    <Form>
                        <Field type="text" name="title" placeholder="Movie Title" />
                        {errors.title && touched.title ? <div className="error__message">{errors.title}</div> : null}
                        <Field type="text" name="picture" placeholder="Link to Picture" />
                        {errors.picture && touched.picture ? <div className="error__message">{errors.picture}</div> : null}
                        <Field type="text" name="description" placeholder="Description" />
                        {errors.description && touched.description ? <div className="error__message">{errors.description}</div> : null}
                        <Field type="date" name="releaseDate" placeholder="Release Date" />
                        {errors.releaseDate && touched.releaseDate ? <div className="error__message">{errors.releaseDate}</div> : null}
                        <Field type="text" name="genres" placeholder="Genres (comma separated)" />
                        {errors.genres && touched.genres ? <div className="error__message">{errors.genres}</div> : null}
                        <Field type="text" name="director" placeholder="Director" />
                        {errors.director && touched.director ? <div className="error__message">{errors.director}</div> : null}
                        <Field type="text" name="cast" placeholder="Cast Actors (comma separated)" />
                        {errors.cast && touched.cast ? <div className="error__message">{errors.cast}</div> : null}
                        <Field type="text" name="trailer" placeholder="Link to Trailer" />
                        {errors.trailer && touched.trailer ? <div className="error__message">{errors.trailer}</div> : null}
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
