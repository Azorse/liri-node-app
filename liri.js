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
      concerts(search);
      break;

    case 'spotify-this-song':
      if(search) {
        getSpotify(search);
        break;
      } else {
        getSpotify('The Sign')
        break;
      }
      break;

    case 'movie-this':
      if(search) {
        getMovies(search);
        break;
      } else {
        getMovies('Mr. Nobody')
        break;
      }
      

    case 'do-what-it-says':
      doWhatItSays();
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


function concerts(search) {

}

function getSpotify(search) {
  spotify
    .search({type: 'track', query: search, limit:1})
    .then(function(response) {
      console.log(response)
      var song = response.tracks.items[0];

      var songSearch = `
      Artist: ${song.artists[0].name}
      Title: ${song.name}
      Preview Link: ${song.preview_url}
      Album: ${song.album.name}
      `
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


function doWhatItSays() {

}

