'use strict';
const axios = require('axios');
const Cashe = require('../Helpers/weatherCashe');
const Forecast = require('../Models/Weather.modal');
let cashe = new Cashe();

const weatherController = async (request, response) => {
    let cityQuery = request.query.cityQuery;
    let latQuery = Number(request.query.lat);
    let lonQuery = Number(request.query.lon);
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?cityQuery=${cityQuery}&key=${process.env.WEATHER_API_KEY}&lat=${latQuery}&lon=${lonQuery}`;
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

function parseWeather(weatherData) {
    try {
        let forecast = weatherData.data.map(day => {
            return new Forecast(day.valid_date, day.weather.description);
        });
        return Promise.resolve(forecast);
    } catch (e) {
        return Promise.reject(e);
    }
}
module.exports = weatherController;