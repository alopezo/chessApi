/**
 * Created by alo on 10/15/17.
 */
var sem = require('semaphore')(1);
var https = require('https');
var _ = require('lodash');
var fs = require('fs');

var result = [];

https.get('https://api.chess.com/pub/country/AR/players', function(res) {
    var body = '';
    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', function () {
        if (res.statusCode != "200") {
            console.error("Got an error: ", res.statusCode);
        } else {
            var response = JSON.parse(body);
            var players = response.players;
            console.log(players.length + " players.");
            // var done = _.after(players.length, function () {
            //     fs.writeFile("chessOutput.json", JSON.stringify(result, null, 4), function (err) {
            //         if (err) {
            //             return console.log(err);
            //         }
            //         console.log("The file was saved!");
            //     });
            // });
            // players.forEach(function (loopPlayer) {
            //     sem.take(function () {
            //         https.get('https://api.chess.com/pub/player/' + loopPlayer, function (res) {
            //             var body = '';
            //             res.on('data', function (chunk) {
            //                 body += chunk;
            //             });
            //             res.on('end', function () {
            //                 if (res.statusCode != "200") {
            //                     console.error(loopPlayer, "Got an error: ", res.statusCode);
            //                     sem.leave();
            //                 } else {
            //                     var chessResponse = JSON.parse(body);
            //                     https.get('https://api.chess.com/pub/player/' + loopPlayer + '/stats', function (res) {
            //                         var body = '';
            //                         res.on('data', function (chunk) {
            //                             body += chunk;
            //                         });
            //                         res.on('end', function () {
            //                             if (res.statusCode != "200") {
            //                                 console.error(loopPlayer, "Got an error: ", res.statusCode);
            //                                 sem.leave();
            //                             } else {
            //                                 var statsResponse = JSON.parse(body);
            //                                 var loopCompilation = {
            //                                     username: loopPlayer,
            //                                     details: chessResponse,
            //                                     stats: statsResponse
            //                                 };
            //                                 result.push(loopCompilation);
            //                                 console.log(loopPlayer, "Stats", statsResponse.chess_daily);
            //                                 sem.leave();
            //                                 done();
            //                             }
            //                         });
            //                     }).on('error', function (e) {
            //                         console.error(loopPlayer, "Got an error: ", e);
            //                         sem.leave();
            //                         done();
            //                     });
            //                 }
            //             });
            //         }).on('error', function (e) {
            //             console.error(loopPlayer, "Got an error: ", e);
            //             sem.leave();
            //             done();
            //         });
            //     });
            // });
        }
    });
});

function convertDate(epoch) {
    if (epoch) {
        var myDate = new Date(epoch*1000);
        return myDate.toGMTString();
    } else {
        return "";
    }
}