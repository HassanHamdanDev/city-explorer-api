'use strict';

class Cashe {
    constructor(key, data = [], date = new Date()) {
        this.key = key;
        this.data = data;
        this.date = date;
    }
}


module.exports = Cashe;
