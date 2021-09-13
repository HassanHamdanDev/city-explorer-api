/* eslint-disable indent */
/* eslint-disable no-undef */
'use strict';

const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
require('dotenv').config();
const weatherData = require('./data/weather.json');
const PORT = process.env.PORT;

server.get('/', (request, response) => {
    response.status(200).send('hello server');
});

server.get('/weather-data', (request, response) => {
    let cities = [];
    let forecastDays;
    let result = [];
    let latQuery = Number(request.query.lat);
    let lonQuery = Number(request.query.lon);

    function isfind(elem) {
        return Number(elem.lat) === latQuery && Number(elem.lon) === lonQuery;
    }
    if (lonQuery && latQuery) {
        weatherData.map(elem => {
            cities.push(elem.city_name);
            forecastDays = elem.data;
            result.push({
                city_name: elem.city_name,
                lon: elem.lon,
                lat: elem.lat,
                forecast: forecastDays.map(day => {
                    return {
                        date: day.valid_date,
                        description: day.weather.description
                    };
                })
            });
        });
        console.log(result);
        let customResponse = result.find(isfind);
        response.status(200).json(customResponse);
    } else {
        response.status(400).send('Please Provide Correct City');
    }
});
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

