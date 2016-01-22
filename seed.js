var mongoose = require('mongoose');
var database = require('./config/database');
mongoose.connect(database.db);

var Player = require('./models/player');
function seedPlayer(playerName) {
    Player.findOne({ name: playerName}, function(err, player) {
        if(err) {
            console.log(err);
        }

        if(!player)
        {
            var createdPlayer = new Player();
            createdPlayer.name = playerName;

            createdPlayer.save(function (err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(playerName + ' created');
                }
            })
        }
    });
}

seedPlayer('Tyler');
seedPlayer('Josh');
seedPlayer('Nate');
seedPlayer('Shawn');
seedPlayer('Michael');