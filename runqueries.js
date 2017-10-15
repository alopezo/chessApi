/**
 * Created by alo on 10/15/17.
 */
var getJSON = require('get-json');
var sem = require('semaphore')(1);
var https = require('https');
var _ = require('lodash');

var textContent = "username\tname\tlocation\tstatus\n";

getJSON('https://api.chess.com/pub/country/AR/players', function(error, response){
    if (error) {
        console.log(error);
    } else {
        console.log(response.players.length + " players.");
        var done = _.after(response.players.length, function() {
            fs.writeFile("chessOutput.txt", textContent, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });
        response.players.forEach(function(loopPlayer) {
            sem.take(function() {
                https.get('https://api.chess.com/pub/player/' + loopPlayer, function(res){
                    var body = '';
                    res.on('data', function(chunk){
                        body += chunk;
                    });
                    res.on('end', function(){
                        if (res.statusCode != "200") {
                            console.error(loopPlayer, "Got an error: ", res.statusCode);
                            sem.leave();
                        } else {
                            var chessResponse = JSON.parse(body);
                            textContent += loopPlayer + "\t" +
                                chessResponse.name + "\t" +
                                chessResponse.location + "\t" +
                                chessResponse.status + "\t" +
                                convertDate(chessResponse.last_online) + "\t" +
                                convertDate(chessResponse.joined) + "\n";
                            console.log(loopPlayer, "OK", chessResponse.name, chessResponse.location, convertDate(chessResponse.last_online));
                            sem.leave();
                            done();
                        }
                    });
                }).on('error', function(e){
                    console.error(loopPlayer, "Got an error: ", e);
                    sem.leave();
                    done();
                });
            });
        });
    }
});

function convertDate(epoch) {
    if (epoch) {
        var myDate = new Date(epoch*1000);
        return myDate.toGMTString();
    } else {
        return "";
    }
}