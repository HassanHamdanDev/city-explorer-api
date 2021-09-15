'use strict';
const axios = require('axios');

const Movie = require('../Models/movie.modal');

const movieController = async (request, response) => {
    let cityQuery = request.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityQuery}`;
    let axiosRessponse = await axios.get(url);
    let MoviesData = axiosRessponse.data;

    let results = MoviesData.results.map(elem => {
        return new Movie(elem.title, elem.overview, elem.vote_average, elem.vote_count, elem.poster_path, elem.popularity, elem.release_date);
    });
    if (results) {
        response.status(200).json(results);
    } else {
        response.status(404).send('Not found');
        response.status(400).send('Please Provide Correct City');
    }
}
module.exports = movieController;