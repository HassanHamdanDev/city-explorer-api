'use strict';
const axios = require('axios');

const Forecast = require('../Models/Weather.modal');

const weatherController = async (request, response) => {
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
}
module.exports = weatherController;