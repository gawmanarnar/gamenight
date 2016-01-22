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

app.get('/', function (req, res) {
    //console.log('Last Wednesday: ' + moment().day(-4).format('ddd, MMM DD')); // Wednesday - 7 = (3) - 7 = - 4
    //console.log('This Wednesday: ' + moment().day(3).format('ddd, MMM DD')); // Wednesday is 3
    //console.log('Next Wednesday: ' + moment().day(10).format('ddd, MMM DD')); // Wednesday + 7 = 3 + 7 = 10

    var thisWednesday = moment().day(3).startOf('day');
    var thisWednesdayEnd = moment(thisWednesday).endOf('day');

    console.log(thisWednesday.toDate());
    console.log(thisWednesdayEnd.toDate());

    Gamenight.findOne({date: { $gte: thisWednesday.toDate(), $lt: thisWednesdayEnd.toDate() }}, function(err, night) {
        if(err) {
            console.log(err);
        } else {
            if(night) {
                console.log('success');
                return res.json({ message: 'success'});
            }

            var newGamenight = new Gamenight();
            newGamenight.date = thisWednesday;

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