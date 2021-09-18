'use strict';

class Restaurant {
    constructor(name, image_url, price, rating, url) {
        this.name = name;
        this.image_url = image_url;
        this.price = price;
        this.rating = rating;
        this.url = url;
    }
}
module.exports = Restaurant;