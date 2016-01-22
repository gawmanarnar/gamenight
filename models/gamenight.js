var mongoose = require('mongoose');
var Game = require('./game');

var gamenightSchema = mongoose.Schema({
    date: {type: Date, required: true, unique: true },
    games: [Game]
});

module.exports = mongoose.model('Gamenight', gamenightSchema);
