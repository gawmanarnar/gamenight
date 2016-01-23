// Load packages
var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');

// Connect to the database
var database = require('./config/database');
mongoose.connect(database.db);

// Create express application
var app = express();

// Load models
var Gamenight = require('./models/gamenight');
var Game = require('./models/game');
var Player = require('./models/player');

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

app.get('/', function (req, res) {

    // In moment, this week's Wednesday corresponds to 3. Next week's Wednesday corresponds to 10 (3 + 7 = 10).
    // If Wednesday has passed in the current week (day > 3), we should be looking to next Wednesday.
    var wednesday =  moment().day(moment().day() > 3 ? 10 : 3).startOf('day');
    var wednesdayEnd = moment(wednesday).endOf('day');

    Gamenight.findOne({date: { $gte: wednesday.toDate(), $lt: wednesdayEnd.toDate() }}, function(err, night) {
        if(err) {
            console.log(err);
        } else {
            if(night) {
                console.log('success');
                return res.json({ message: 'success'});
            }

            var newGamenight = new Gamenight();
            newGamenight.date = wednesday;

            Player.find({}, function(err, players) {
                shuffle(players);

                players.forEach(function(player) {
                    console.log(player.name);
                });

                while(players.length > 0 ) {
                    console.log('here');
                    var newGame = Game();

                    var player1 = players.pop();
                    newGame.player1 = player1.name;

                    if(players.length > 0) {
                        var player2 = players.pop();
                        newGame.player2 = player2.name;
                        player2.played.push(newGame.player1);
                        player1.played.push(newGame.player2);
                    } else {
                        player1.played.push("");
                    }
                    newGamenight.games.push(newGame);
                }
            });

            newGamenight.save(function (error) {
                if(error) {
                    console.log(err);
                } else {
                    console.log('created');
                    return res.json({ message: 'created'});
                }
            });
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);