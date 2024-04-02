import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './LandingPage'
import Home from './Home'
import Search from './Search'
import PlayList from './PlayList'
import WebPlayback from './WebPlayback'
import LikedSongs from './likedSongs'
import ArtistPage from './ArtistPage'
import Albums from './Albums'

const SampleRoute = () => {
    return (
        <Routes>



            <Route index element={<Home />} />
            <Route path='search' element={<Search />} />
            <Route path='playlist/:id' element={<PlayList />} />
            <Route path='likedSongs' element={<LikedSongs />} />
            <Route path='artist/:id' element={<ArtistPage />} />
            <Route path='album/:id' element={<Albums />} />




            {/* <Route path='/home' element={<Home />} />
    <Route path='/playlist/:id' element={<PlayList />} />
    <Route path='/search' element={<Search />} /> */}

        </Routes>
    )
}

export default SampleRoute
