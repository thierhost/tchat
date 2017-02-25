'use strict';
var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({

    username: String,
    salon: String,
    message: String
});

module.exports = mongoose.model('Message', MessageSchema);