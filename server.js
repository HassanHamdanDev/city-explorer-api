'use strict';

const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;
const weatherController = require('./Controllers/Weather.controller');
const movieController = require('./Controllers/Movie.controller');
const restaurantsController = require('./Controllers/Restaurants.controller');

server.get('/', (req, res) => {
    res.status(200).json({ 'massage': 'Hello Server' });
});

server.get('/weather', weatherController);
server.get('/yelp', restaurantsController)
server.get('/movies', movieController);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

