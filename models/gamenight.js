var mongoose = require('mongoose');
var Game = require('./game');

var gamenightSchema = mongoose.Schema({
    date: Date,
    games: [Game]
});

module.exports = mongoose.model('Gamenight', gamenightSchema);
