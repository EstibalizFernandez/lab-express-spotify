const express = require('express');
const app = express();
const hbs = require('hbs');
const PORT = 3000;
const path = require('path');

var SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = 'b228112e351a4c25b0d158db8a0c6fba',
    clientSecret = '88cdc85d301f4263845d9c280460a084';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res)=>{
  res.render('home');
});

app.get('/artists', (req, res)=>{
  let selecArtist = req.query.artist;
  spotifyApi.searchArtists(selecArtist)
  .then(data => {
    let artists = data.body.artists.items
    res.render('artists', {artists});
    console.log(data.body.artists.id);
  })
  .catch(err => {
    console.error(err);
  })
});
app.get('/albums/:artistId', (req, res) => {
  let id = req.params.artistId
  spotifyApi.getArtistAlbums(id, { limit: 10 })
  .then(function(data) {
    return data.body.albums.map(function(a) {
      return a.id;
    });
  })
  .then(function(albums) {
    return spotifyApi.getAlbums(albums);
  })
  .then(function(data) {
    console.log(data.body);
    res.render("single-artist")
  });
});

app.listen(PORT, console.info('UP AND RUNNING!!!'));

