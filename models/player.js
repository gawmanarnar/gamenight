var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
    name: { type: String, required: true },
    played: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}]
});

module.exports = mongoose.model('Player', playerSchema);