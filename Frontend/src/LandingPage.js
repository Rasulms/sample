import React, { useEffect, useState } from 'react';
import './App.css';
import Button from './Button';
import PageRoutes from './PageRoutes';
import companyLogo from './spo.png';
import SampleRoute from './SampleRoute';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import Home from './Home';
import Search from './Search';
import WebPlayback from './WebPlayback';
import { useDispatch, useSelector } from 'react-redux';
import ReturnParams from './api/ReturnParams';
import axios from 'axios';
import sampleimg from './Album Cover/Yuvan4.jpeg'
import { updatesongInformation } from './Redux/SongInfo';
import { updatedisplayInfo } from './Redux/profile';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Modals from 'react-modal';



const LandingPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const displayData = useSelector((state) => state.profile.displayInformation);
    var songData = useSelector((state) => state.songInfo.songInformation)
    var deviceData = useSelector((state) => state.deviceInfo.deviceInformation)

    // console.log('song data', songData);

    const [logOutModal, setlogOutModal] = useState(false)
    const [avaiableDeviceModal, setAvaiableDeviceModal] = useState(false)

    const SPOTIFY_ENDPOINT_API = `https://api.spotify.com`
    const [currentUserPlaylist, SetCurrentUserPlaylist] = useState([])
    const [isPlaying, setIsPlaying] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [likedSongs, setLikedSongs] = useState(false);
    const [disconnectPlayer, setDisconnectPlayer] = useState(false);
    const [deviceList, setDeviceList] = useState([]);
    const [availbtn, setavailbtn] = useState(false);



    // const [availableDevices, setAvailableDevices] = useState([]);
    // const [player, setPlayer] = useState(undefined);
    var u_token = localStorage.getItem('user_token')
    const [showSearch, setShowSearch] = useState(false);


    useEffect(() => {



        var tokenCheck = localStorage.getItem('user_token')
        const UserID = localStorage.getItem('user_Id')

        // console.log('tokken isss ', tokenCheck);
        const searchHeader = document.getElementsByClassName('searchHeader')

        if (tokenCheck) {
            currentUser(tokenCheck)
            // console.log(displayData.SpotifyUserID);
            getCurrentUserPlaylist(tokenCheck, UserID)

            // getPlayerInfo(tokenCheck)
        }


    }, [])



    const driverObj = driver({
        showProgress: true,
        steps: [
            { element: '#displayProfile', popover: { title: 'Introduction', description: 'This is your profile and by clicking on the profile you can Logout', side: "left", align: 'start' } },
            { element: '#user_library', popover: { title: 'Library', description: 'It displays the user saved library', side: "right", align: 'start' } },
            { element: '#webPlayer', popover: { title: 'Webplayback', description: 'Only premium users can avail this feature ', side: "top", align: 'center' } },
            { popover: { title: 'Spotify Stream', description: 'Go ahead and start enjoying music' } }
        ]
    });



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
                await dispatch(updatedisplayInfo(DisplayInfo))

            }).catch(err => console.log('err in get current user in album page', err))
        if (displayData.profilepic != '') {
            driverObj.drive();

        }
    }
    const placeOrderStyle = {
        content: {
            width: '20%',
            height: '57vh',
            left: '72%',
            top: '30%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#121212',
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden'
        }
    }





    const getPlayerInfo = async (USER_TOKEN) => {
        await axios.get(`https://api.spotify.com/v1/me/player?market=IN`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then(async (res) => {

                if (res.data) {
                    var artists = '';
                    var playingSongs = res.data.item;
                    var deviceInfo = res.data.device;
                    // console.log(res.data);
                    // var artists = res.data.artists;
                    // const artists_Join = artists.map((item)=>item.name.join(', '))


                    if (playingSongs.artists.length == 1) {
                        artists = playingSongs.artists[0].name
                    }
                    else if (playingSongs.artists.length == 2) {
                        artists = `${playingSongs.artists[0].name}, ${playingSongs.artists[1].name}`

                    }
                    else {
                        artists = `${playingSongs.artists[0].name}, ${playingSongs.artists[1].name}, ${playingSongs.artists[2].name}`

                    }
                    const currentInfo = {

                        name: playingSongs.name,
                        artist: artists,
                        thumbImage: playingSongs.album.images[0].url,
                        type: playingSongs.type,
                        song_id: playingSongs.id,
                        album_id: playingSongs.album.id,
                        device_id: deviceInfo.id,
                        song_duration: playingSongs.duration_ms,
                        progress_ms: playingSongs.progress_ms

                    }
                    // console.log('display', res.data);
                    setIsPlaying(res.data.is_playing)
                    setShuffle(res.data.shuffle_state)
                    setRepeat(res.data.repeat_state === 'off' ? false : true)
                    checkLikedorNot(u_token, currentInfo.song_id)
                    return await dispatch(updatesongInformation(currentInfo))
                }
            }
            ).catch(err => console.log('err in playerInfo', err))


    }
    const getCurrentUserPlaylist = async (USER_TOKEN, USER_ID) => {

        await axios.get(`https://api.spotify.com/v1/me/playlists?limit=10`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then((res) => {
                // console.log('liked playlist', res.data.items);
                SetCurrentUserPlaylist(res.data.items)
            }).catch(err => console.log('err in get current user playlist', err))
        // return GetUser
    }



    const handlelogout = async (USER_TOKEN) => {
        localStorage.clear();
        setDisconnectPlayer(true)

        setlogOutModal(false)
        navigate('/')


    }
    const handleNextSong = async (e, USER_TOKEN) => {
        e.preventDefault();
        await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${songData.device_id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${USER_TOKEN}`,
            }
        });
        // getPlayerInfo(USER_TOKEN)

    }

    const handlePrevSong = async (e, USER_TOKEN) => {
        e.preventDefault();
        await fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${songData.device_id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${USER_TOKEN}`,
            }
        });
        // getPlayerInfo(USER_TOKEN)
    }
    const handlePlayPause = async (e, btn_type, USER_TOKEN) => {
        e.preventDefault()
        if (btn_type === 'Pause') {

            setIsPlaying(false);

            await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${songData.device_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            });
            // getPlayerInfo(USER_TOKEN)
        }
        if (btn_type === 'Play') {

            setIsPlaying(true);
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${songData.device_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            });
            // getPlayerInfo(USER_TOKEN)
        }
    };
    const handleShuffle = async (e, USER_TOKEN, btn_type) => {
        // console.log(btn_type);

        if (btn_type === 'Shuffle') {
            await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=false&device_id=${songData.device_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            });
            setShuffle(false)
        }
        else {
            await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=${songData.device_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            });
            setShuffle(true)
        }
    }
    const handleRepeat = async (e, USER_TOKEN, btn_type) => {

        if (btn_type === 'repeat') {
            await fetch(`https://api.spotify.com/v1/me/player/repeat?state=off&device_id=${songData.device_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            });
            setRepeat(false)
        }
        else {
            await fetch(`https://api.spotify.com/v1/me/player/repeat?state=context&device_id=${songData.device_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            });
            setRepeat(true)
        }

    }

    const checkLikedorNot = async (USER_TOKEN, SONG_ID) => {


        await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${SONG_ID}`, {
            headers: {
                Authorization: `Bearer ${USER_TOKEN}`,
            }
        }).then(res => setLikedSongs(res.data[0]))

    }

    const handleLikedSong = async (btn_type, USER_TOKEN) => {
        if (btn_type == 'notLiked') {
            // console.log(songData.song_id);
            await fetch(`https://api.spotify.com/v1/me/tracks?ids=${songData.song_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            }).then(res => setLikedSongs(true)).catch(err => console.log('err in save liked songs ', err))


        }
        else {
            await fetch(`https://api.spotify.com/v1/me/tracks?ids=${songData.song_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                }
            })
            setLikedSongs(false)
        }
    }
    // const handleTransferPlayback = async (USER_TOKEN) => {
    //     console.log(songData.device_id);
    //     await fetch(`https://api.spotify.com/v1/me/player?device_ids=${songData.device_id}?play=true`, {
    //         method: 'PUT',
    //         headers: {
    //             Authorization: `Bearer ${USER_TOKEN}`,
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => console.log(res)).catch(err => console.log('err in Transfer playback ', err))

    // }


    const getAvailableDevices = async (USER_TOKEN) => {

        setAvaiableDeviceModal(true)
        await axios.get(`https://api.spotify.com/v1/me/player/devices`, {
            headers: {
                Authorization: `Bearer ${USER_TOKEN}`,
            }
        }).then(res => {
            setDeviceList(res.data['devices'])
            // console.log(res.data['devices']);
        }).catch(err => console.log('get available device ', err))
        currentUser(USER_TOKEN)


    }
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setAvaiableDeviceModal(false)
        }
    }

    const handleTransferPlayback = async (deviceId, TOKEN) => {

        setAvaiableDeviceModal(false)

        const data = {
            "device_ids": [
                deviceId
            ]
        };

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                console.error('Error:', errorMessage);
            } else {
                const responseData = await response.json();
                // console.log('FETCH Success:', responseData);
            }
        } catch (error) {
            console.error('Error in transfer playback:', error.message);
        }

    }


    return (
        <div className='home-main' >
            <div style={{ display: 'flex', gap: '10px', height: '88vh', flexWrap: 'wrap' }} >

                <section className='Asection'  >
                    <div className='home-section' >
                        {/* <div>
                            <img src={companyLogo} alt="" width={'24px'} height={'25px'} style={{ position: 'relative', top: '-1px' }} />
                            <label htmlFor="home" className='lab' >Spotify</label>
                        </div> */}
                        <div className='home-div'>
                            <Button
                                title="Home"
                                icon_className="fa-solid fa-house fa-lg"
                                NavName="home"
                            />
                        </div>
                        <div className='search-div  ' onClick={() => { setShowSearch(true) }}>
                            <Button
                                title="Search"
                                NavName="search"
                                icon_className="fa-solid fa-magnifying-glass fa-lg"

                            />

                        </div>

                    </div>
                    <div id='user_library' className='library-section' >
                        <div style={{ padding: '20px' }} >
                            <i className="fa-solid fa-layer-group" style={{ color: '#ffffff' }}></i>
                            <label className='fontStyle' style={{ marginLeft: '7px' }} htmlFor="library">
                                {displayData.username ? displayData.username : "Your"}'s Library
                            </label>
                        </div>
                        <div className='scrollable-content' style={{ overflowY: 'scroll', width: '100%', height: '85%', display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }} >

                            {currentUserPlaylist ? currentUserPlaylist.map((item, index) => {
                                return (
                                    <Link key={index} className='library_playlist_box_Link' style={{ width: '50%', textDecoration: 'none' }} to={`/home/playlist/${item.id}`} >
                                        <div className='library_playlist_box'  >
                                            <div style={{ padding: '13px' }}>
                                                <img height={140} width={142} src={item.images ? item.images[1].url : ''} alt="sample" />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0px 13px 0px 13px' }}>
                                                <span className='fontStyle' style={{ color: 'white ', textDecoration: 'none ', fontSize: '14px', display: 'block' }} >{item.name.length > 17 ? `${item.name.slice(0, 15)} ...` : item.name}</span>
                                                <p className='fontStyle' style={{ color: 'white ', textDecoration: 'none ', fontSize: '12px', marginBottom: '0' }} >{item.owner.display_name}</p>


                                            </div>
                                        </div>
                                    </Link>
                                )
                            }) : "No Playlist found"}

                        </div>

                    </div>
                </section>
                <div className='SearchMain'   >
                    <header className='searchHeader' >
                        <div className='backButton_Div' >
                            <button className='backButton' >


                                <svg style={{ color: "#ffffff" }} data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16">
                                    <path fill="white" d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
                                </svg>
                            </button>
                            <button className='backButton' >
                                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16">
                                    <path fill="white" d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z"></path>
                                </svg>
                            </button>
                        </div>

                        {displayData.profilepic != false && <div id='displayProfile' style={{ cursor: 'pointer', display: 'flex', margin: '10px 40px 10px 10px', justifyContent: 'center', alignItems: 'center' }} >
                            <img onClick={() => setlogOutModal(true)} height={35} style={{ borderRadius: '50%' }} src={displayData.profilepic} alt="" />
                        </div>}
                        {displayData.profilepic == "" ? <div onClick={() => setlogOutModal(true)} style={{ display: 'flex', margin: '10px 40px 10px 10px', justifyContent: 'center', alignItems: 'center' }} >
                            <span className='fontStyle' style={{ height: '35px', width: '35px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backgroundColor: 'grey', fontSize: '19px', fontWeight: 500, textTransform: 'capitalize', paddingTop: '10%' }}>{displayData.username ? displayData.username.slice(0, 1) : null}</span>
                        </div> : null}
                        <CModal
                            visible={logOutModal}
                            aria-labelledby="Logout"
                            backdroptransition={{ timeout: 10 }}
                            modaltransition={{ timeout: 20 }}
                        >
                            <CModalHeader style={{ backgroundColor: '#121212' }}  >
                                <CModalTitle style={{ color: 'white', fontSize: '20px' }} className='fontStyle'>Log Out Spotify ?</CModalTitle>
                            </CModalHeader>
                            <CModalBody style={{ backgroundColor: '#121212' }}>
                                <span className='fontStyle' style={{ color: '#9a9a9a', fontStyle: '13px' }} >Are you sure, you want to log out from spotify ?</span>
                            </CModalBody>
                            <CModalFooter style={{ backgroundColor: '#121212' }}>
                                <CButton onClick={() => handlelogout(u_token)} className='fontStyle' style={{ border: 'none', outline: 'none', height: '33px', fontSize: '15px', color: 'white', textAlign: 'center', backgroundColor: '#1ddd61' }} >
                                    Yes, sure
                                </CButton>
                                <CButton onClick={() => setlogOutModal(false)} className='fontStyle' style={{ outline: 'none', height: '33px', fontSize: '15px', color: 'white', textAlign: 'center' }} color="secondary" >
                                    No
                                </CButton>
                            </CModalFooter>
                        </CModal>
                    </header>
                    <SampleRoute
                    />

                </div >
                <footer id='webPlayer'>
                    <div style={{ height: '9vh', display: 'flex', paddingLeft: '5px', width: '33%' }}>
                        {songData.thumbImage && <div style={{ height: '58px', width: '58px' }}>
                            <img src={songData.thumbImage} alt="" height={58} width={58} style={{ borderRadius: '5px' }} />

                        </div>}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '3%' }}>
                            <span className='fontStyle' style={{ fontSize: '14px' }}>{songData.name}</span>
                            <span className='fontStyleLight' style={{ fontSize: '12px', fontWeight: '600', color: '#b2b2b2' }}>{songData.artist}</span>
                        </div>
                        {songData.thumbImage && <div style={{ display: 'flex', alignItems: 'center', marginLeft: '3%' }}>
                            {!likedSongs ?
                                <i onClick={() => { handleLikedSong('notLiked', u_token) }} className="fa-regular fa-heart fa-sm" style={{ color: 'white' }}></i>
                                : <i onClick={() => { handleLikedSong('Liked', u_token) }} className="fa-solid fa-heart fa-sm" style={{ color: '#1fde64' }}></i>

                            }
                        </div>}
                    </div>
                    <WebPlayback

                        // handleNextSong={handleNextSong}
                        handleShuffle={handleShuffle}
                        shuffle={shuffle}
                        handleRepeat={handleRepeat}
                        handlePlayPause={handlePlayPause}
                        handlePrevSong={handlePrevSong}
                        handleNextSong={handleNextSong}
                        isPlaying={isPlaying}
                        repeat={repeat}
                        // handleShuffle={handleShuffle()}
                        disconnectPlayer={disconnectPlayer}

                    />




                    <div style={{ display: 'flex', justifyContent: "center", outline: 'none', border: 'none' }} >
                        <button onClick={() => { getAvailableDevices(u_token) }} className='btn'><i class="fa-solid fa-desktop" style={{ color: '#ffffff' }}></i></button>
                    </div>
                    <Modals ariaHideApp={false} isOpen={avaiableDeviceModal}
                        style={placeOrderStyle} shouldCloseOnOverlayClick={true}
                        onOverlayClick={(e) => handleOverlayClick(e)}
                        onRequestClose={() => setAvaiableDeviceModal(false)}

                    >

                        {deviceList.map((item) => {
                            if (item.is_active) {
                                return (<div key={item.id} style={{ height: '7vh', width: '97%', margin: '20px auto 20px auto', display: 'flex', gap: '15px', justifyContent: 'start' }}>
                                    <div style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                        {item.type === "Computer" ? <i className="fa-solid fa-laptop fa-sm" style={{ color: '#1fdf64', fontSize: '30px' }}></i> :
                                            <i className="fa-solid fa-mobile fa-sm" style={{ color: 'white', fontSize: '30px' }}></i>}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <span className='fontStyleBold' style={{ color: 'white' }}>Current device</span>
                                        <span className='fontStyle' style={{ color: '#1fdf64' }} >{item.name ? item.name : 'No device is playing'}</span>

                                    </div>
                                </div>)

                            }

                        })}
                        <span className='fontStyleBold' style={{ color: 'white', marginBottom: '15px' }}>Select another device</span>

                        <div className='scrollable-content' style={{ overflowY: 'scroll' }}>
                            <div style={{ width: '97%', margin: '0px auto 20px auto', display: 'flex', gap: '15px', justifyContent: 'start', flexDirection: 'column' }}>
                                {deviceList && deviceList.map((dev) => {
                                    if (dev.is_active === false) {
                                        return (
                                            <div onClick={() => handleTransferPlayback(dev.id, u_token)} key={dev.id} className='webdevice' style={{ cursor: 'pointer', display: 'flex', height: '7vh', gap: '15px', borderRadius: '5px' }}>
                                                <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    {dev.type === "Computer" ? <i className="fa-solid fa-laptop fa-sm" style={{ color: '#1fdf64', fontSize: '30px' }}></i> :
                                                        <i className="fa-solid fa-mobile fa-sm" style={{ color: 'white', fontSize: '30px' }}></i>}                                    </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className='fontStyle' style={{ color: 'white', fontSize: '14px' }}>{dev.name.length > 23 ? dev.name.slice(0, 23) + '..' : dev.name}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </Modals>
                </footer>

            </div>

        </div>
    )
}

export default LandingPage
