var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
    name: { type: String, required: true },
    played: [String]
});

module.exports = mongoose.model('Player', playerSchema);