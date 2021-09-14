'use strict';

const express = require('express');
const server = express();
const cors = require('cors');
const axios = require('axios');
server.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;

server.get('/', (req, res) => {
    res.status(200).json({ 'massage': 'Hello Server' });
});

let handleWeather = async (request, response) => {
    let cityQuery = request.query.cityQuery;
    let latQuery = Number(request.query.lat);
    let lonQuery = Number(request.query.lon);
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?cityQuery=${cityQuery}&key=${process.env.WEATHER_API_KEY}&lat=${latQuery}&lon=${lonQuery}`;
    let axiosRessponse = await axios.get(url);
    let weatherData = axiosRessponse.data;
    let forecast = weatherData.data.map(day => {
        return new Forecast(day.valid_date, day.weather.description);
    });
    if (forecast) {
        response.status(200).json(forecast);
    } else {
        response.status(404).send('Not found');
        response.status(400).send('Please Provide Correct City');
    }
};

server.get('/weather', handleWeather);

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

let handleMovies = async (request, response) => {
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
};

server.get('/movies', handleMovies);

class Movie {
    constructor(title, overview, average_votes, total_votes, image_url, popularity, released_on) {
        this.title = title;
        this.overview = overview;
        this.average_votes = average_votes;
        this.total_votes = total_votes;
        this.image_url = "https://image.tmdb.org/t/p/w500/" + image_url;
        this.popularity = popularity;
        this.released_on = released_on;
    }
}

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

