var client_id = 'ec6b847801ec4ae982423ace1ef6dd1b';
var redirect_uri = 'http://localhost:3000/';
const express = require('express')
const app = express();
const PORT = 5555;

app.get('/login', async function (req, res) {

    var generateRandomString = function (length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    // res.redirect('https://accounts.spotify.com/authorize?' )
    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: "http://localhost:5555/",
        state: state
    })
    // await fetch('https://accounts.spotify.com/authorize', auth_query_parameters).then(function (response) {
    await fetch('https://api.spotify.com/v1/albums/4ecrmvaAeV5JxU0JUJhTFU?market=IN').then(function (response) {



        console.log('response, ' + JSON.stringify(response));
        return response;
    })
    console.log('success');
});

app.listen(PORT, () => console.log('connected'))