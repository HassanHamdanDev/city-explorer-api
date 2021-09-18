'use strict';
const axios = require('axios');
const Movie = require('../Models/movie.modal');
const Cashe = require('../Helpers/movieCashe');
let cashe = new Cashe();

const movieController = async (request, response) => {
    let cityQuery = request.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityQuery}`;
    let currenDate = new Date();
    let key = cityQuery;

    if (cashe.key === cityQuery && cashe.data.length > 0 && cashe.date.getDate() === currenDate.getDate()) {
        response.status(200).json(cashe.data);
    } else {
        cashe.data = await axios.get(url).then(res => parseWeather(res.data));
        if (cashe.data) {
            cashe.key = key;
            cashe.date = currenDate;
            response.status(200).json(cashe.data);
        } else {
            response.status(404).send('Not found');
            response.status(400).send('Please Provide Correct City');
        }
    }
}

function parseWeather(movieData) {
    try {
        let results = movieData.results.map(elem => {
            return new Movie(
                elem.title,
                elem.overview,
                elem.vote_average,
                elem.vote_count,
                elem.poster_path,
                elem.popularity,
                elem.release_date
            );
        });
        return Promise.resolve(results);
    } catch (e) {
        return Promise.reject(e);
    }
}
module.exports = movieController;