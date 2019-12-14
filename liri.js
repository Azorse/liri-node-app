require('dotenv').config();

var keys = require('./keys.js');
var moment = require('moment');
var fs = require('fs');
var axios = require('axios');
var Spotify = require(`node-spotify-api`);
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var search = process.argv.slice(3).join(' ');

liriApp(command,search);


function liriApp(command, search) {
  switch (command.toLowerCase()) {
    case 'concert-this':
      getConcerts(search);
      break;

    case 'spotify-this-song':
      if(search) {
        getSpotify(search);
        break;
      } else {
        getSpotify('The Sign')
        break;
      }

    case 'movie-this':
      if(search) {
        getMovies(search);
        break;
      } else {
        getMovies('Mr. Nobody')
        break;
      }
      

    case 'do-what-it-says':
      doWhatItSays(command, search);
      break;

    default:
      console.log(`
      Please use one of the following commands:
        concert-this
        spotify-this-song
        movie-this
        do-what-it-says
      `)
  }
}


function getConcerts(search) {
  axios
    .get(`https://rest.bandsintown.com/artists/${search}/events?app_id=codingbootcamp`)
    .then(function(response) {
      //console.log(response)
      var concerts = response.data;
      for (var i = 0; i < concerts.length; i++) {
        console.log(`
          Venues: ${concerts[i].venue.name}
          Venue Location: ${concerts[i].venue.city}, ${concerts[i].venue.country}
          Date of Event: ${moment(concerts[i].datetime).format("MM/DD/YYYY")}`
          );
      }
    }).catch(function(err) {
      console.log(err)
    });
}

function getSpotify(search) {
  spotify
    .search({type: 'track', query: search, limit:1})
    .then(function(response) {
      var song = response.tracks.items[0];
      var songSearch = `
        Artist: ${song.artists[0].name}
        Title: ${song.name}
        Preview Link: ${song.preview_url}
        Album: ${song.album.name}
        `;
      console.log(songSearch);
    }).catch(function(err){
      console.log(`Spotifty had and error: ${err}`)
    }); 
}

function getMovies(search) {
  axios
    .get(`https://www.omdbapi.com/?apikey=trilogyt=${search}`)
    .then(function(response) {
      var movie = response.data;

      var movieSearch = `
        Title: ${movie.Title}
        Release year: ${movie.Year}
        IMDB rating: ${movie.imdbRating}
        Rotten Tomatoes rating: ${movie.Ratings[1].Value}
        Country: ${movie.Country}
        Language: ${movie.Language}
        Plot: ${movie.Plot}
        Actors: ${movie.Actors}
        `;
      console.log(movieSearch)
    });
}


function doWhatItSays(command, search) {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(error);
    } else {
      var newArr = data.split(",");
      command = newArr[0];
      search = newArr[1].split('"');
      liriApp(command, search);
    }
  });
}


