'use strict';
const axios = require('axios');
const Restaurant = require('../Models/restaurant.modal');
const Cashe = require('../Helpers/restaurantsCashe');
let cashe = new Cashe();

const restaurantsController = async (request, response) => {
    let cityQuery = request.query.location;
    let url = `https://api.yelp.com/v3/businesses/search?location=${cityQuery}&limit=20`;
    let currenDate = new Date();
    let key = cityQuery;

    if (cashe.key === cityQuery && cashe.data.length > 0 && cashe.date.getDate() === currenDate.getDate()) {
        response.status(200).json(cashe.data);
    } else {
        cashe.data = await axios.get(url, { headers: { 'Authorization': `Bearer ${process.env.YELP_API_KEY}` } })
            .then(res => parseWeather(res.data));
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

function parseWeather(restaurantsData) {
    try {
        let results = restaurantsData.businesses.map(elem => {
            return new Restaurant(
                elem.name,
                elem.image_url,
                elem.price,
                elem.rating,
                elem.url,
            );
        });
        return Promise.resolve(results);
    } catch (e) {
        return Promise.reject(e);
    }
}
module.exports = restaurantsController;