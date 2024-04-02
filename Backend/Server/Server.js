const express = require('express')
const app = express();
const PORT = 5000;
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
const querystring = require('querystring')
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const qs = require('qs');
var SpotifyWebApi = require('spotify-web-api-node');


// var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid')
const fetchSpotifyToken = require('../fetchSpotifyToken')
const UserInfo = require('../Models/UserDetails.js')
const axios = require('axios')
// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,            //access-control-allow-credentials:true
//     optionSuccessStatus: 200
// }
app.use(cors());
app.use(express.json())

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const mongoAtlasUrl = "mongodb://mohamedrasul99slm:rasul123@ac-e5tfo2b-shard-00-00.689xleb.mongodb.net:27017,ac-e5tfo2b-shard-00-01.689xleb.mongodb.net:27017,ac-e5tfo2b-shard-00-02.689xleb.mongodb.net:27017/test"

async function main() {
    await mongoose.connect(mongoAtlasUrl + '?ssl=true&replicaSet=atlas-5jmbmu-shard-0&authSource=admin&retryWrites=true&w=majority').then(() => console.log('db connected successfully')).catch(err => console.log('err in mongodb connection', err))
}
const CLIENT_ID = '108736de212a46b481ebb34a1dad6c5f'
const CLIENT_SECRET_ID = 'f1bc62c3a67d436abddf208aba722135'
const SPOTIFY_ENDPOINT = 'https://accounts.spotify.com/authorize'
const REDIRECT_URL_AFTER_LOGIN = 'http://localhost:5000/auth/callback'
const SPACE_DELIMITER = "%20";
const SCOPE = ["user-read-playback-state", "user-read-email", "user-read-private", "user-read-recently-played"]
const SCOPES_URL_PARAM = SCOPE.join(SPACE_DELIMITER)



app.post('/api/register', async (req, res) => {
    console.log('request body :', req.body);

    try {
        var reqData = req.body;
        if (Object.keys(reqData).length === 0) {
            throw new Error("invalid data to create an account");
        }
        const ExistingEmail = await UserInfo.findOne({ user_email: reqData.email }).countDocuments();

        if (ExistingEmail) {
            throw new Error("Email already exist.")
        }

        console.log('passsss is', reqData.password);


        var user = 'userid-' + uuidv4();

        const userData = new UserInfo({
            user_id: user,
            user_name: reqData.username,
            user_email: reqData.email,
            user_password: reqData.password,
            user_status: 1,
        })


        var result = await userData.save();
        console.log(result);

        res.status(200).json({ "status": 200, data: result, "message": "registered successfully", "error": false })


    } catch (err) {
        console.log(err);
        res.status(500).send("server error")
    }

})



app.post('/api/loginAccount', async (req, res) => {
    // console.log('request body :', req.body);
    // console.log('hello login api');

    try {
        const { email, password } = req.body;
        const result = await UserInfo.findOne({
            user_email: email
        })
        if (!result || result.isPasswordMatch(password) === false) {
            res.status(400).json({ "status": 400, data: " ", "message": "User not found or password error", "error": true })

        }
        console.log('user found');
        var token = await fetchSpotifyToken()

        result.user_token = token



        res.status(200).json({ "status": 200, data: result, "message": "user found logged in successfully", "error": false })

    } catch (err) {
        console.log(err);
        res.status(500).send("try/server error")
    }

})
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
app.get('/auth/login', async (req, res) => {

    const CODE = req.body.code;
    var credentials = {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET_ID,
        redirectUri: REDIRECT_URL_AFTER_LOGIN
    };

    var spotifyApi = new SpotifyWebApi(credentials);
    console.log('spotifyApi'.spotifyApi);
    spotifyApi.authorizationCodeGrant(CODE).then(data => {

        res.json({
            accessToken: data.body.access_token
        })
    }).catch((err) => { console.log('err in auth/login api', err) })

    console.log(authorizeURL);

});



app.get('/auth/callback', async (req, res) => {
    console.log('callback api started');
    console.log('callback req', req);

    // console.log('callback req', req.query);

    // console.log('callback req.code', req.query);
    // var code = await req.query.code;
    // res.status(200).json({
    //     status: 200,
    //     data: { req: dataResult },
    //     message: "success",
    //     error: false
    // });
    // console.log('callback code', code);

    // try {
    //     const authOptions = {
    //         url: 'https://accounts.spotify.com/api/token',
    //         method: 'post',
    //         params: {
    //             code: code,
    //             redirect_uri: "http://localhost:3000/home",
    //             grant_type: 'authorization_code'
    //         },
    //         headers: {
    //             'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET_ID).toString('base64')),
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         }
    //     };
    //     console.log('authOptions', authOptions);
    //     const response = await axios(authOptions);
    //     const accessToken = response.data.access_token;

    //     // Handle the access token as needed, e.g., store it in the database or send it to the client.
    //     console.log('Access Token is:', accessToken);

    //     res.status(200).json({
    //         status: 200,
    //         data: accessToken,
    //         message: "Spotify token generated successfully",
    //         error: false
    //     });
    // } catch (error) {
    //     console.error('Error in Spotify token request:', error);
    //     res.status(500).json({
    //         status: 500,
    //         data: null,
    //         message: "Error generating Spotify token",
    //         error: true
    //     });
    // }
});





// app.get('/spotifyAuth/callback', function (req, res) {

//     var code = req.query.code || null;
//     var state = req.query.state || null;

//     if (state === null) {
//         res.redirect('/#' +
//             querystring.stringify({
//                 error: 'state_mismatch'
//             }));
//     } else {
//         var authOptions = {
//             url: 'https://accounts.spotify.com/api/token',
//             form: {
//                 code: code,
//                 redirect_uri: redirect_uri,
//                 grant_type: 'authorization_code'
//             },
//             headers: {
//                 'content-type': 'application/x-www-form-urlencoded',
//                 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + '29d91cc1fade4271bc428384de142316').toString('base64'))
//             },
//             json: true
//         };
//     }
// });





app.listen(PORT, () => {
    console.log(`Server started Succesfully on ${PORT}`)
    main()
})

// app.get('/auth/login', (req, res) => {

//     var scope = "streaming\ user-read-email\ user-read-private"

//     var state = generateRandomString(16);

//     const spotify_client_id = 'ec6b847801ec4ae982423ace1ef6dd1b'


//     var auth_query_parameters = new URLSearchParams({
//         response_type: "code",
//         client_id: spotify_client_id,
//         scope: scope,
//         redirect_uri: "http://localhost:5000/auth/callback",
//         state: state
//     })
//     // console.log(auth_query_parameters);

//     res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
// });

// var generateRandomString = function (length) {
//     var text = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//     for (var i = 0; i < length; i++) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// };

// app.get('/auth/callback', async (req, res) => {

//     var code = req.query.code;

//     const spotify_client_id = 'ec6b847801ec4ae982423ace1ef6dd1b'

//     const spotify_client_secret = '75a52c5a46104816a0e15f51de60665d'



//     var authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         form: {
//             code: code,
//             redirect_uri: "http://localhost:3000/auth/callback",
//             grant_type: 'authorization_code'
//         },
//         headers: {
//             'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         json: true
//     };

//     await axios.post(authOptions, function (error, response, body) {
//         if (!error && response.statusCode === 200) {
//             var access_token = body.access_token;
//             console.log('Access Token is : ', access_token);
//             res.redirect('/')
//         }
//     });
// })