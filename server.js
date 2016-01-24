// Load packages
var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');

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

    async.waterfall([
        function(callback) {
            Gamenight.findOne({date: { $gte: wednesday.toDate(), $lt: wednesdayEnd.toDate() }}, function(error, night) {
                if (error) throw error;
                callback(error, night);
            });
        },
        function(night, callback) {
            if(night) {
                callback(night)
            } else {
                Player.find({}, function (error, players) {
                    if (error) throw error;

                    shuffle(players);

                    var newGamenight = new Gamenight({date: wednesday.toDate()});
                    var games = [];
                    while (players.length > 0) {
                        var player1 = players.pop();
                        var newGame = Game({player1: player1.name, player2: ''});

                        if (players.length > 0) {
                            var player2 = players.pop();
                            newGame.player2 = player2.name;

                            player1.played.push(player2._id);
                            player2.played.push(player1._id);
                        }

                        games.push(newGame);
                    }

                    async.each(games, function (game, callback) {
                        game.save(function (error, item) {
                            newGamenight.games.push(item._id);
                            callback();
                        });
                    }, function () {
                        if (newGamenight.games.length > 0) {
                            newGamenight.save(function (error, createdGame) {
                                if (error) {
                                    throw error
                                } else {
                                    callback(createdGame);
                                }
                            });
                        } else {
                            console.log('no games?');
                        }
                    });
                });
            }
        }
    ], function(error) {
        Gamenight.findOne({date: { $gte: wednesday.toDate(), $lt: wednesdayEnd.toDate() }}).populate('games').exec(function (err, item) {
            console.log(item);

            //console.log(item.date);
            //console.log(item.games);
        });
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);