'use strict';
var mongoose = require('mongoose');

var SalonSchema = mongoose.Schema({

    title: String
});

module.exports = mongoose.model('Salon', SalonSchema);