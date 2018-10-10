require("dotenv").config();

var keys = require("./keys.js");

var request = require("request")

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var moment = require('moment');
moment().format();

var fs = require("fs")

var nodeArgs = process.argv;
var userInput = "";


for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + " " + nodeArgs[i];
    } else {
        userInput += nodeArgs[i];
    }
}



var userCommand = process.argv[2];

function runLiri() {
    switch (userCommand) {
        case "concert-this":

            var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
            request(queryURL, function (error, response, body) {

                if (!error && response.statusCode === 200) {

                    var data = JSON.parse(body);

                    for (var i = 0; i < data.length; i++) {

                        console.log("Venue: " + data[i].venue.name);

                        if (data[i].venue.region == "") {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
                            //Append data to log.txt

                        } else {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);

                        }
                        var date = data[i].datetime;
                        date = moment(date).format("MM/DD/YYYY");
                        console.log("Date: " + date)

                        console.log("----------------")
                    }
                }
            });
            break;
        case "spotify-this-song":
            if (!userInput) {
                userInput = "The Sign Ace of Base";
            }
            spotify.search({
                type: "track",
                query: userInput
            }, function (err, data) {
                if (err) {
                    console.log("Error: " + err)
                }
                var info = data.tracks.items

                for (var i = 0; i < info.length; i++) {

                    var albumObject = info[i].album;
                    var trackName = info[i].name
                    var preview = info[i].preview_url

                    var artistsInfo = albumObject.artists

                    for (var j = 0; j < artistsInfo.length; j++) {
                        console.log("Artist: " + artistsInfo[j].name)
                        console.log("Song Name: " + trackName)
                        console.log("Preview of Song: " + preview)
                        console.log("Album Name: " + albumObject.name)
                        console.log("----------------")
                        //Append data to log.txt

                    }
                }
            })
            break;
        case "movie-this":

            if (!userInput) {
                userInput = "Mr Nobody";
            }

            var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("IMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)
                }
            });
            break;
        case "do-what-it-says":
            var fs = require("fs");
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error)
                }
                //Split data into array
                var textArr = data.split(",");
                userCommand = textArr[0];
                userInput = textArr[1];
                runLiri();
            })
    }
}

// if (userCommand == "do-what-it-says") {
//     var fs = require("fs");
//     fs.readFile("random.txt", "utf8", function (error, data) {
//         if (error) {
//             return console.log(error)
//         }
//         //Split data into array
//         var textArr = data.split(",");
//         userCommand = textArr[0];
//         userInput = textArr[1];
//         runLiri();
//     })
// }

runLiri();