import React from 'react'
import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Search from './Search';
import PlayList from './PlayList';
import Login from './Login';
import LandingPage from './LandingPage';
import Register from './Register';
import WebPlayback from './WebPlayback';
import LikedSongs from './likedSongs';
import ArtistPage from './ArtistPage';
import Albums from './Albums';

const PageRoutes = ({ category, Token }) => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            {/* <Route path='/register' element={<Register />} /> */}

            <Route path='/home/' element={<LandingPage />} >
                <Route index element={<Home />} />
                <Route path='search' element={<Search />} />
                <Route path='playlist/:id' element={<PlayList />} />
                <Route path='likedSongs' element={<LikedSongs />} />
                <Route path='artist/:id' element={<ArtistPage />} />
                <Route path='album/:id' element={<Albums />} />


            </Route>



            {/* <Route path='/home' element={<Home />} />
            <Route path='/playlist/:id' element={<PlayList />} />
            <Route path='/search' element={<Search />} /> */}

        </Routes>
    )
}

export default PageRoutes;

// var client_id = 'CLIENT_ID';
// var redirect_uri = 'http://localhost:8888/callback';

// var app = express();

// app.get('/login', function(req, res) {

//   var state = generateRandomString(16);
//   var scope = 'user-read-private user-read-email';

//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });


