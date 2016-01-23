var mongoose = require('mongoose');

var gameSchema =  mongoose.Schema({
    player1: { type: String, required: true},
    player2: { type: String }
});

module.exports = mongoose.model('Game', gameSchema);
