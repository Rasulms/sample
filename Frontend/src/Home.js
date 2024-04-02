import React, { useEffect, useState } from 'react'
// import sleepImage from './images/sleep.jpeg';
// import Button from './Button';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Arr2 from './Album Cover/Arr2.jpeg'
import Arr1 from './Album Cover/Arr1.jpg'
import Arr3 from './Album Cover/Arr3.jpeg'
import Arr4 from './Album Cover/Arr4.jpeg'
import Yuvan1 from './Album Cover/Yuvan1.jpg'
import Yuvan2 from './Album Cover/Yuvan2.jpg'
import Yuvan3 from './Album Cover/Yuvan3.jpeg'
import Yuvan4 from './Album Cover/Yuvan4.jpeg'
import Yuvan5 from './Album Cover/Yuvan5.jpeg'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux';
import { updatedisplayInfo } from './Redux/profile.js'


const Home = () => {
    const dispatch = useDispatch();

    const displayData = useSelector((state) => state.profile.displayInformation);
    var songData = useSelector((state) => state.songInfo.songInformation)
    var deviceData = useSelector((state) => state.deviceInfo.deviceInformation)

    var ARTIST_ARR = '1mYsTxnqsietFxj1OgoGbG'

    const navigate = useNavigate()
    const SPOTIFY_ENDPOINT_API = 'https://api.spotify.com'

    const [userTopItems, setUserTopItems] = useState([])
    const [userlikedArtists, setUserlikedArtists] = useState([])
    const [recentlyPlayedTrack, setRecentlyPlayedTrack] = useState([])

    const [arrSongs, SetArrSongs] = useState([])

    const [featurePlaylist, SetFeaturePlaylist] = useState([])
    const USER_TOKEN = localStorage.getItem('user_token')

    // let location = useLocation()
    // const displayInfo = location.state.loginValue;
    // console.log('value from login to home', displayInfo);
    // const [logOutModal, setlogOutModal] = useState(false)
    useEffect(() => {
        const changeBG = document.getElementsByClassName('SearchMain');
        changeBG[0].style.backgroundImage = `linear-gradient(to top,#181818, #201060)`

        if (USER_TOKEN) {
            currentUser(USER_TOKEN)
            getCurrentUserTopItems(USER_TOKEN)
            getFeaturePlaylist(USER_TOKEN)
            getUserLikedArtists(USER_TOKEN)
            getRecentlyPlayedTrack(USER_TOKEN)
            getArtistAlbums(USER_TOKEN, ARTIST_ARR)
        }


    }, [])

    const currentUser = async (USER_TOKEN) => {
        await axios.get(`https://api.spotify.com/v1/me`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then(async (res) => {
                // console.log(res)
                const DisplayInfo = await {
                    username: res.data.display_name,
                    profilepic: res.data.images.length > 0 ? res.data.images[0].url : '',
                    SpotifyUserID: res.data.id,
                    domain: 'spotify.com',
                    show: true,
                    product: res.data.product,
                    type: res.data.type

                }
                // console.log('DisplayInfo', DisplayInfo);
                await dispatch(updatedisplayInfo(DisplayInfo))
            }).catch(err => console.log('err in get current user in home page', err))
    }

    const getCurrentUserTopItems = async (USER_TOKEN) => {
        // console.log('tokenn in home comp', USER_TOKEN)
        await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=medium_term`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then((res) => setUserTopItems(res.data.items)).catch(err => console.log('err in get current user top item', err))
    }
    const getUserLikedArtists = async (USER_TOKEN) => {
        // console.log('tokenn in home comp', USER_TOKEN)
        await axios.get(`https://api.spotify.com/v1/me/following?type=artist`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then((res) => setUserlikedArtists(res.data.artists.items)).catch(err => console.log('err in get user liked artists', err))
    }

    const getRecentlyPlayedTrack = async (USER_TOKEN) => {
        // console.log('tokenn in home comp', USER_TOKEN)
        await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then((res) => {
                setRecentlyPlayedTrack(res.data.items)
                // console.log('recent', res.data);
            }).catch(err => console.log('err getRecentlyPlayedTrack', err))
    }





    var ALBUM_DATA = [
        {
            Arr: [{
                id: 1,
                title: "This is A.R. Rahman",
                description: "The essesntial tracks, all in on",
                AlbumId: "37i9dQZF1DZ06evO0KEAbC",
                coverImage: Arr1
            },
            {
                id: 2,
                title: "Bollywood Central ",
                description: " Jab baje toh seedha dil ke centre mein lage ❤️",
                AlbumId: "37i9dQZF1DWXtlo6ENS92N",
                coverImage: Arr3
            },
            {
                id: 3,
                title: "00's Love Hit's ",
                description: "Fall in love with 00's Bollywood like never before! ",
                AlbumId: "37i9dQZF1DWVq1SXCH6uFn",
                coverImage: Arr2
            },
            {
                id: 4,
                title: "Bollywood Mush ",
                description: "Let these songs be the background score to your love story ",
                AlbumId: "37i9dQZF1DXdpQPPZq3F7n",
                coverImage: Arr4
            }],
            Yuvan: [{
                id: 1,
                title: "This Is Yuvan Shankar Raja",
                description: "This is Yuvan Shankar Raja. The essential tracks, all in one playlist",
                AlbumId: "37i9dQZF1DWXtlo6ENS92N",
                coverImage: Yuvan1
            },
            {
                id: 2,
                title: "This Is Yuvan Shankar Raja's Radio ",
                description: "With G. V. Prakash, Hiphop Tamizha, Harris Jayaraj and more",
                AlbumId: "37i9dQZF1E4A7qVDtn7Af6",
                coverImage: Yuvan2
            },
            {
                id: 3,
                title: " Hot Hits Tamil ",
                description: "Tune into the Hottest tracks of Kollywood! Cover : Leo",
                AlbumId: "37i9dQZF1DX1i3hvzHpcQV",
                coverImage: Yuvan3
            },
            {
                id: 4,
                title: "Latest Tamil",
                description: "New Music from Kollywood. Cover : Captain Miller",
                AlbumId: "37i9dQZF1DWVo4cdnikh7Z",
                coverImage: Yuvan4
            },
            {
                id: 5,
                title: "Tamil Romance",
                description: "The best in romantic tunes from Tamil cinema. Cover : Leo",
                AlbumId: "37i9dQZF1DWYfvJNWU1bKi",
                coverImage: Yuvan5
            }],
            Bestofartists: [{
                id: 1,
                title: "This Is Hiphop Tamizha",
                description: "This is Hiphop Tamizha. The essential tracks, all in one playlist.",
                AlbumId: "37i9dQZF1DZ06evO4u84Yc",
                coverImage: 'https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO4u84Yc-default.jpg'
            },
            {
                id: 2,
                title: "This is Santhosh Narayanan ",
                description: "This is Santhosh Narayanan. The essential tracks, all in one playlist.",
                AlbumId: "37i9dQZF1DZ06evO3lhE0Q",
                coverImage: 'https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO3lhE0Q-default.jpg'
            },
            {
                id: 3,
                title: "This is G.V Prakash ",
                description: "This is G. V. Prakash. The essential tracks, all in one playlist.",
                AlbumId: "37i9dQZF1DZ06evO3uUCuI",
                coverImage: 'https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO3uUCuI-default.jpg'
            },
            {
                id: 4,
                title: "This is Sid Sriram ",
                description: "This is Sid Sriram. The essential tracks, all in one playlist",
                AlbumId: "37i9dQZF1DZ06evO4ovoG0",
                coverImage: 'https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO4ovoG0-default.jpg'
            },
            {
                id: 5,
                title: "This is S.P. Balasubrahmanyam ",
                description: "This is S. P. Balasubrahmanyam. The essential tracks, all in one playlist.",
                AlbumId: "37i9dQZF1DZ06evO1ei1Qn",
                coverImage: 'https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO1ei1Qn-default.jpg'
            }]
        }


    ]

    // console.log(ALBUM_DATA[0].Yuvan);
    const handlelogout = () => {
        localStorage.clear()
        // setlogOutModal(false)
        navigate('/')


    }
    const getFeaturePlaylist = async (USER_TOKEN) => {

        await axios.get(`https://api.spotify.com/v1/browse/featured-playlists?country=IN&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then((res) => SetFeaturePlaylist(res.data.playlists.items)).catch(err => console.log('err in get feature playlist', err))
        // return GetUser
    }
    const handleScroll = (event) => {
        const searchHeader = document.getElementsByClassName('searchHeader')

        if (event.currentTarget.scrollTop > 300) {
            // console.log('scrokk', );
            // searchHeader[0].style.backdropFilter = 'blur(3px)'
            searchHeader[0].style.backgroundColor = ''
            searchHeader[0].style.backdropFilter = 'blur(30px)'



        } else if (event.currentTarget.scrollTop == 0 || event.currentTarget.scrollTop < 350) {
            searchHeader[0].style.backgroundColor = 'transparent'

            searchHeader[0].style.backdropFilter = 'blur(0px)'

        }

    };

    const getArtistAlbums = async (USER_TOKEN, ArtistID) => {

        await axios.get(`https://api.spotify.com/v1/artists/${ArtistID}/albums?include_groups=compilation&market=IN&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then((res) => SetArrSongs(res.data.items)).catch(err => console.log('err in get feature playlist', err))
        // return GetUser
    }
    // const fetchPlaylistById = async (Token, PlaylistID) => {
    //     console.log('Token is ', Token);
    //     console.log('PlaylistID is ', PlaylistID);


    //     await axios.get(`https://api.spotify.com/v1/playlists/${PlaylistID}`,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${Token}`,
    //             },
    //         }
    //     )
    //         .then((response) => {
    //             response.data.uri
    //         })
    //         .catch(err => console.log('err is ', err))

    // }
    const PlayPlaylistSong = async (USER_TOKEN, PlaylistID) => {

        await axios.get(`https://api.spotify.com/v1/playlists/${PlaylistID}`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }
        )
            .then(async (response) => await playSongOnClick(USER_TOKEN, response.data.uri))
            .catch(err => console.log('err is ', err))





    }

    const playSongOnClick = async (TOKEN, CONTEXT_URI) => {
        // console.log(CONTEXT_URI);

        const data = {
            "context_uri": CONTEXT_URI,
            "offset": {
                "position": 5
            },
            "position_ms": 0
        };

        const DEVICE_ID = deviceData.device_id
        // console.log(DEVICE_ID, 'from play song on click');

        await axios.put(
            `https://api.spotify.com/v1/me/player/play?device_id=${DEVICE_ID}`,
            JSON.stringify(data),
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(response => {
                // console.log('Success:', response.data);
            })
            .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
            });

    }


    return (
        <div className='MainHome' onScroll={handleScroll}   >
            <section className='artist_section_outer scrollable-content'  >
                <h3>Greeting</h3>
                <div className='' style={{ gap: '10px', width: '100%', display: 'flex', flexWrap: 'wrap' }} >
                    <Link key={5000} style={{ textDecoration: 'none' }} to={`/home/likedSongs`} >
                        <div className='likedSongsBG' style={{
                            width: '363px', height: '50px', borderRadius: '6px', display: 'flex',
                            backgroundColor: '#29214a',
                            overflow: 'hidden'
                        }} >
                            <div className='likedSongImageBox' style={{ height: '100%', width: '14%' }} >
                                <img src={`https://misc.scdn.co/liked-songs/liked-songs-300.png`} height={'100%'} alt="noimg" />
                            </div>
                            <div className='likedSongBox' style={{ width: '86%' }} >
                                <span className='fontStyle' style={{ color: 'white' }} >Liked Songs</span>
                                <div className='likedsongPlaybtnoutDiv ' style={{ height: '100%', width: '12%', display: 'none', alignItems: 'center', position: 'relative', bottom: '47px', left: '265px' }} >
                                    <button className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '70%', width: '34px', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%' }}  >
                                        <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px' }}></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </Link>
                    {recentlyPlayedTrack.map((song, index) => {
                        return (

                            <div key={index} className='likedSongsBG' style={{
                                width: '363px', height: '50px', borderRadius: '6px', display: 'flex',
                                backgroundColor: '#29214a',
                                overflow: 'hidden'
                            }} >
                                <Link style={{ textDecoration: 'none' }} to={`/home/album/${song.track.album.id}`} >

                                    <div className='likedSongImageBox' style={{ height: '100%', width: '14%' }} >
                                        <img src={song.track.album.images[1].url} height={'100%'} alt="noimg" />
                                    </div>
                                </Link>

                                <div className='likedSongBox' style={{ width: '86%' }} >
                                    <span className='fontStyle' style={{ color: 'white' }} >{song.track.album.name.length >= 35 ? song.track.album.name.slice(0, 35) + '..' : song.track.album.name}</span>

                                    <div className='likedsongPlaybtnoutDiv ' style={{ height: '100%', width: '12%', display: 'none', alignItems: 'center', position: 'relative', bottom: '47px', left: '265px' }} >
                                        <button onClick={() => { playSongOnClick(USER_TOKEN, song.track.album.uri) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '70%', width: '34px', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%' }}  >
                                            <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px' }}></i>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        )
                    })}

                </div>

                <h3 className='title'>Best of artists</h3>
                <div className='artist_section_flex' >

                    {ALBUM_DATA[0].Bestofartists.map((Album, index) => {

                        return (

                            <div className='artist_section_outer_box' key={Album.AlbumId} >

                                <div className='artist_box' >

                                    <div style={{ padding: '13px 13px 0px 12px', height: '72%', overflow: 'hidden' }} >
                                        <img src={Album.coverImage} alt="coverImage" style={{ objectFit: 'fill', borderRadius: '10px' }} width={'170px'} height={'170px'} />
                                        <div className='roundPlayBtn ' style={{ display: 'flex', opacity: 0, justifyContent: 'end', alignItems: 'center', position: 'relative', bottom: '55px', right: '5px' }} >
                                            <button onClick={() => { PlayPlaylistSong(USER_TOKEN, Album.AlbumId) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '48px', width: '48px', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%', boxShadow: '0px 6px 20px 5px' }}  >
                                                <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px', fontSize: '20px' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <Link style={{ textDecoration: 'none' }} to={`/home/playlist/${Album.AlbumId}`} >

                                        <div className='artist_box_2'>
                                            <span className='fontStyle' style={{ fontSize: '16px', color: 'white' }} >{Album.title.length >= 22 ? Album.title.slice(0, 20) + '...' : Album.title}</span>
                                            <span className='' style={{ fontSize: '13px', color: '#a0a0a0' }} >{Album.description.length > 28 ? Album.description.slice(0, 34) + '..' : Album.description}</span>
                                        </div>
                                    </Link>
                                </div>

                            </div>
                        )
                    })}
                </div>
                <h3 className='title'>Popular Playlist</h3>
                <div className='artist_section_flex' >
                    {featurePlaylist && featurePlaylist.map((item, index) => {

                        return (

                            <div className='artist_section_outer_box' key={item.id} >
                                <div className='artist_box' >
                                    <div style={{ padding: '13px 13px 0px 12px', height: '72%', overflow: 'hidden' }}>
                                        <img src={item.images[0].url} alt="" style={{ objectFit: 'fill', borderRadius: '10px' }} width={'170px'} height={'170px'} />
                                        <div className='roundPlayBtn ' style={{ display: 'flex', opacity: 0, justifyContent: 'end', alignItems: 'center', position: 'relative', bottom: '55px', right: '5px' }} >
                                            <button onClick={() => { PlayPlaylistSong(USER_TOKEN, item.id) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '48px', width: '48px', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%', boxShadow: '0px 6px 20px 5px' }}  >
                                                <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px', fontSize: '20px' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <Link style={{ textDecoration: 'none' }} to={`/home/playlist/${item.id}`} >
                                        <div className='artist_box_2'>
                                            <span className='fontStyle' style={{ fontSize: '16px', color: 'white' }} >{item.name.length >= 22 ? item.name.slice(0, 22) + ' ..' : item.name}</span>
                                            <span className='' style={{ fontSize: '13px', color: '#a0a0a0' }} >{item.description.length > 45 ? item.description.slice(0, 45) + '..' : item.description}</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                        )
                    })}
                </div>

                <h3 className='title'>For fans of A.R Rahman</h3>
                <div className='artist_section_flex' >

                    {arrSongs.map((song, index) => {

                        return (

                            <div className='artist_section_outer_box' key={song.id} >
                                <div className='artist_box' >
                                    <div style={{ padding: '13px 13px 0px 12px', height: '72%', overflow: 'hidden' }} >
                                        <img src={song.images[1].url} alt="" style={{ objectFit: 'fill', borderRadius: '10px' }} width={'170px'} height={'170px'} />
                                        <div className='roundPlayBtn ' style={{ display: 'flex', opacity: 0, justifyContent: 'end', alignItems: 'center', position: 'relative', bottom: '55px', right: '5px' }} >
                                            <button onClick={() => { PlayPlaylistSong(USER_TOKEN, song.uri) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '48px', width: '48px', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%', boxShadow: '0px 6px 20px 5px' }}  >
                                                <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px', fontSize: '20px' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <Link style={{ textDecoration: 'none' }} to={`/home/album/${song.id}`} >
                                        <div className='artist_box_2'>
                                            <span className='fontStyle' style={{ color: 'white', fontSize: '16px' }} >{song.name.length >= 50 ? song.name.slice(0, 20) + ' ..' : song.name}</span>
                                            {/* <span style={{ fontSize: '13px', color: '#a0a0a0' }} >{song.description.length > 45 ? song.description.slice(0, 45) + ' ...' : song.description}</span> */}
                                        </div>
                                    </Link>

                                </div>
                            </div>
                        )
                    })}
                </div>
                <h3 className='title'>For fans of Yuvan</h3>
                <div className='artist_section_flex' >

                    {ALBUM_DATA[0].Yuvan.map((Album, index) => {

                        return (<div className='artist_section_outer_box' key={Album.AlbumId} >
                            <div className='artist_box' >
                                <div style={{ padding: '13px 13px 0px 12px', height: '72%', overflow: 'hidden' }}>

                                    <img src={Album.coverImage} alt="" style={{ objectFit: 'fill', borderRadius: '10px' }} width={'170px'} height={'170px'} />
                                    <div className='roundPlayBtn ' style={{ display: 'flex', opacity: 0, justifyContent: 'end', alignItems: 'center', position: 'relative', bottom: '55px', right: '5px' }} >

                                        <button onClick={() => { PlayPlaylistSong(USER_TOKEN, Album.AlbumId) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '48px', width: '48px', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%', boxShadow: '0px 6px 20px 5px' }}  >
                                            <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px', fontSize: '20px' }}></i>
                                        </button>
                                    </div>


                                </div>
                                <Link style={{ textDecoration: 'none' }} to={`/home/playlist/${Album.AlbumId}`} >
                                    <div className='artist_box_2'>
                                        <span className='fontStyle' style={{ color: 'white', fontSize: '16px' }} >{Album.title.length >= 20 ? Album.title.slice(0, 18) + ' ..' : Album.title}</span>
                                        <span style={{ fontSize: '13px', color: '#a0a0a0' }} >{Album.description.length > 45 ? Album.description.slice(0, 43) + ' ..' : Album.description}</span>
                                    </div>
                                </Link>
                            </div>
                        </div>)
                    })}
                </div>
                <h3 className='title'>{displayData.username ? displayData.username + 's' : ""} Liked Artist's</h3>
                <div className='artist_section_flex' >

                    {userlikedArtists.map((artist, index) => {

                        return (


                            <div className='artist_section_outer_box' key={artist.id}  >

                                <div className='artist_box' >

                                    <div style={{ padding: '5px 13px 0px 14px', height: '72%', overflow: 'hidden' }} >
                                        <img src={artist.images[1].url} alt="" style={{ objectFit: 'fill', borderRadius: '50%' }} width={'165px'} height={'160px'} />
                                        <div className='roundPlayBtn ' style={{ display: 'flex', opacity: 0, justifyContent: 'end', alignItems: 'center', position: 'relative', bottom: '55px', right: '5px' }} >
                                            <button onClick={() => { PlayPlaylistSong(USER_TOKEN, artist.id) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '48px', width: '48px', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%', boxShadow: '0px 6px 20px 5px' }}  >
                                                <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px', fontSize: '20px' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <Link style={{ textDecoration: 'none' }} to={`/home/artist/${artist.id}`} >
                                        <div style={{ marginTop: '10px' }} className='artist_box_2'>
                                            <span className='fontStyle' style={{ fontSize: '16px', color: 'white' }} >{artist.name.length > 18 ? artist.name.slice(0.18) : artist.name}</span>
                                            <span className='' style={{ fontSize: '14px', color: '#a0a0a0' }} >{artist.type}</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>)
                    })}

                </div>

            </section>


        </div >
    )
}

export default Home
