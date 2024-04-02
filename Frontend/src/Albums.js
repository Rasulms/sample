import React, { useEffect, useState } from 'react'
import sample from './images/NewRelease.jpeg'
import { useParams } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import getCurrentUser from './api/getCurrentUser'
import { updatedisplayInfo } from './Redux/profile'


const Albums = () => {
    const dispatch = useDispatch();

    const AlbumID = useParams()
    var songData = useSelector((state) => state.songInfo.songInformation)
    var deviceData = useSelector((state) => state.deviceInfo.deviceInformation)


    const [playlists, setPlayLists] = useState({})
    const [albumData, setAlbumData] = useState([])


    const [isLoading, setIsLoading] = useState(true)
    const TOKEN_FROM_LOCALSTORAGE = localStorage.getItem('user_token')
    const [artist, setArtist] = useState({
        name: '', image: '', followers: '', context_uri: ''
    })

    useEffect(() => {
        const HeaderchangeBG = document.getElementsByClassName('searchHeader');
        HeaderchangeBG[0].style.backgroundImage = `transparent`
        // console.log(HeaderchangeBG);
        const changeBG = document.getElementsByClassName('SearchMain');
        changeBG[0].style.backgroundImage = `linear-gradient(to top,#181818, #2f4441)`
        // console.log(changeBG[0].style.backgroundImage);

        if (TOKEN_FROM_LOCALSTORAGE) {
            getAlbumById(TOKEN_FROM_LOCALSTORAGE, AlbumID.id)
            currentUser(TOKEN_FROM_LOCALSTORAGE)
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

            }).catch(err => console.log('err in get current user in album page', err))
    }

    const getAlbumById = async (USER_TOKEN, AlbumID) => {
        await axios.get(`https://api.spotify.com/v1/albums/${AlbumID}`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKEN}`,
                },
            }).then(async (res) => {
                console.log(res.data);
                await setAlbumData(res.data)
                await getArtistById(USER_TOKEN, res.data?.artists[0].id)
                console.log(res.data);

            }).catch(err => console.log('err in getAlbumById', err))
        // return GetUser
    }
    const getArtistById = async (TOKEN, ARTIST_ID) => {
        // console.log('artist id', ARTIST_ID.id);
        await axios.get(`https://api.spotify.com/v1/artists/${ARTIST_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }).then((res) => {
                setArtist({
                    name: res.data.name, image: res.data.images[2].url, followers: res.data.followers.total, context_uri: res.data.uri
                })
                setIsLoading(false)

            }
            ).catch(err => console.log('artists details api', err))

    }

    const playSongOnClick = async (TOKEN, CONTEXT_URI) => {
        // console.log(CONTEXT_URI);
        const DEVICE_ID = deviceData.device_id
        // console.log('from play song on click', DEVICE_ID);
        // console.log('from play song on click token', TOKEN);


        const data = {
            "context_uri": CONTEXT_URI,
            "offset": {
                "position": 5
            },
            "position_ms": 0
        };

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${DEVICE_ID}`, {
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
                console.log('FETCH Success:', responseData);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }

    }

    return (
        <  >
            {!isLoading ? <>
                {/* <div className='playlist_outerBox' > */}
                <section className='playlist_Top_Section'  >
                    <div className='image_Box' >
                        <img src={albumData?.images[0]?.url} alt="" height={'230px'} width={'230px'} style={{ margin: '70px 17px 0px 22px', borderRadius: '10px' }} />
                    </div>
                    <div className='content_Box' style={{ paddingTop: '190px' }}>
                        <div className='content_Box_inside2' >
                            <span className='fontStyle' style={{ textTransform: 'capitalize', fontSize: '14px' }}>{albumData.type}</span>
                            <span className='fontStyle' style={{ fontSize: '43px', fontWeight: '600', marginTop: '0', marginBottom: 0 }} >{albumData.name}</span>
                            {/* <span className='fontStyle' style={{ fontWeight: '400', color: '#a7a7a7', fontSize: '14px' }} >{playlists.Description}</span> */}
                            <ul style={{ marginLeft: '-3%', display: 'flex', alignItems: 'center', fontSize: '14px', gap: '15px' }} key={playlists.PlaylistID} >
                                <li style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <img height={20} style={{ borderRadius: '50%' }} src={artist.image} alt="" />
                                </li>
                                <li style={{ listStyle: 'none' }}  >{artist.name}</li>
                                <li>{albumData.total_tracks} tracks</li>
                            </ul>
                        </div>
                    </div>

                </section>
                <section style={{ marginTop: '20px', height: '50px', width: '96%', margin: '25px auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                    <button
                        onClick={() => { playSongOnClick(TOKEN_FROM_LOCALSTORAGE, albumData.uri) }}
                        className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '100%', width: '4.5%', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%' }}  >
                        <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px' }}></i>
                    </button>
                </section>
                <section>
                    <Table style={{ width: '95%', margin: 'auto' }} hover >
                        <thead>
                            <tr style={{ borderBottom: '1px solid' }} >
                                <th style={{ width: '3%', fontWeight: '100 ', fontSize: '14px', verticalAlign: 'middle' }} className='table_heading'>#</th>
                                <th style={{ width: '85%', fontWeight: '100 ', fontSize: '14px' }} className='table_heading'>Title</th>

                                <th className='table_heading'>
                                    <i className="fa-regular fa-clock fa-md" style={{ color: '#a7a7a7' }}></i>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {albumData.tracks.items.map((item, index) => {
                                return (
                                    <tr className='fontStyle likedSongTable' style={{ marginTop: '10px', borderRadius: '5px' }} >
                                        <td className='table_data'  >{index + 1}</td>

                                        <td style={{ display: 'flex', gap: '10px' }} className='table_data'  >
                                            <div>
                                                <span className='fontStyle' style={{ display: 'block', color: 'white', fontSize: '16px', cursor: 'pointer' }} >{item.name} </span>

                                                <span className='fontStyle' style={{ color: '#a7a7a7', fontSize: '14px' }}> {item.artists.length === 2 ? item.artists[0].name + ', ' + item.artists[1].name : item.artists.length === 1 ? item.artists[0].name : item.artists.length === 3 ? item.artists[0].name + ', ' + item.artists[1].name + item.artists[2].name : item.artists[0].name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className='table_data' style={{ fontSize: '0.9rem' }} >
                                            {Math.floor(item.duration_ms / 60000) + ":" + (((item.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : '') + ((item.duration_ms % 60000) / 1000).toFixed(0)}
                                        </td>

                                    </tr>
                                )
                            })}

                        </tbody>
                    </Table>

                </section>
                {/* </div> */}
            </> : <>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '75%', height: '-webkit-fill-available', margin: 'auto' }} >
                    <div className='loader' ></div>
                </div>
            </>}
        </>

    )
}

export default Albums
