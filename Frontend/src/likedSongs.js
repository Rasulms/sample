import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import { updatesongInformation } from './Redux/SongInfo.js'
import { useDispatch, useSelector } from 'react-redux';


// import sampleImage from './images/sleep.jpeg'


const LikedSongs = () => {
    const dispatch = useDispatch();

    // const Album_Id = useParams()
    const [likedSongs, setLikedSongs] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    var songData = useSelector((state) => state.songInfo.songInformation)

    const displayData = useSelector((state) => state.profile.displayInformation);
    const TOKEN_FROM_LOCALSTORAGE = localStorage.getItem('user_token')

    // console.log(displayData);





    useEffect(() => {

        // console.log(TOKEN_FROM_LOCALSTORAGE);

        fetchLikedSongs(TOKEN_FROM_LOCALSTORAGE)
    }, [])

    const fetchLikedSongs = async (Token) => {
        // console.log('Token is ', Token);

        await axios.get(`https://api.spotify.com/v1/me/tracks?market=IN&limit=50`,
            {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }
        )
            .then(async (response) => {
                // console.log('liked songs ', response.data);
                await setLikedSongs({
                    TotalSong: response.data.total,
                    Name: 'Liked Songs',
                    Type: 'Playlist',
                    CoverImage: `https://misc.scdn.co/liked-songs/liked-songs-300.png`,
                    Tracks: response.data.items
                })
                return await setIsLoading(false)

            })
            .catch(err => console.log('err is ', err))

    }
    // const handleSong = async (e, songId, access_token) => {
    //     e.preventDefault()
    //     console.log('api started');
    //     await axios.get(`https://api.spotify.com/v1/tracks/${songId}?market=IN`,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${access_token}`,
    //             },
    //         }).then(async (res) => {
    //             var artists = '';
    //             var songName = '';
    //             if (res.data.artists.length == 1) {
    //                 artists = res.data.artists[0].name
    //             }
    //             else if (res.data.artists.length == 2) {
    //                 artists = `${res.data.artists[0].name}, ${res.data.artists[1].name}`

    //             }
    //             else {
    //                 artists = `${res.data.artists[0].name}, ${res.data.artists[1].name}, ${res.data.artists[2].name}`

    //             }
    //             const songInfo = {

    //                 name: res.data.name,
    //                 artist: artists,
    //                 thumbImage: res.data.album.images[0].url,
    //                 type: res.data.type,
    //                 song_id: res.data.id,
    //                 album_id: res.data.album.id

    //             }
    //             console.log('single track data ', res.data)

    //             // return await dispatch(updatesongInformation(songInfo))

    //         }
    //         ).catch(err => console.log('err in track api ', err))


    // }
    const checkLikedorNot = async (USER_TOKEN, SONG_ID) => {


        await axios.get(`https://api.spotify.com/v1/me/tracks/contains?ids=${SONG_ID}`, {
            headers: {
                Authorization: `Bearer ${USER_TOKEN}`,
            }
        }).then(res => setLikedSongs(res.data[0]))

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

        const DEVICE_ID = songData.device_id
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
        <  >
            {!isLoading ? <>
                {/* <div className='playlist_outerBox' > */}
                <section className='playlist_Top_Section'  >
                    <div className='image_Box' >
                        <img src={likedSongs.CoverImage} alt="" height={'230px'} width={'220px'} style={{ margin: '70px 10px 35px 20px', borderRadius: '10px' }} />
                    </div>
                    <div className='content_Box' >
                        <div className='content_Box_inside' >
                            <span style={{ textTransform: 'capitalize', fontSize: '14px', paddingLeft: '5px' }}>{likedSongs.Type}</span>
                            <span style={{ height: '50%', fontSize: '90px', fontWeight: '600' }} >{likedSongs.Name}</span>
                            {/* <p style={{ fontWeight: '400', color: '#a7a7a7', marginTop: '-8px', marginBottom: 0, fontSize: '14px' }} >{likedSongs.Description}</p> */}
                            <ul style={{ marginLeft: '-3%', display: 'flex', alignItems: 'center', fontSize: '14px' }}  >
                                {/* {displayData.profilepic && <li style={{ cursor: 'pointer', display: 'flex', margin: '10px 40px 10px 10px', justifyContent: 'center', alignItems: 'center' }} >
                                    <img height={35} style={{ borderRadius: '50%' }} src={displayData.profilepic} alt="" />
                                </li>} */}
                                <li style={{ cursor: 'pointer', display: 'flex', margin: '10px 40px 10px 10px', justifyContent: 'center', alignItems: 'center' }} >
                                    <img height={35} style={{ borderRadius: '50%' }} src={displayData.profilepic} alt="" />
                                </li>
                                <li style={{ listStyle: 'none' }}  >{likedSongs.TotalSong} songs</li>
                            </ul>
                        </div>
                    </div>

                </section>
                <section style={{ marginTop: '20px', height: '50px', width: '96%', margin: '25px auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                    <button
                        onClick={() => { playSongOnClick(TOKEN_FROM_LOCALSTORAGE) }}
                        className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '100%', width: '4.5%', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%' }}  >
                        <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px' }}></i>
                    </button>
                </section>
                <section >
                    <Table style={{ width: '95%', margin: 'auto' }} borderless >
                        <thead className='fontStyle'>
                            <tr style={{ borderBottom: '1px solid' }} >
                                <th style={{ width: '3%', fontWeight: '100  ' }} className='table_heading'>#</th>
                                <th style={{ width: '39%', fontWeight: '100 ' }} className='table_heading'>Title</th>
                                <th style={{ width: '32%', fontWeight: '100 ' }} className='table_heading'>Album</th>
                                <th style={{ width: '20%', fontWeight: '100 ' }} className='table_heading'>Added at</th>
                                <th className='table_heading'>
                                    <i className="fa-regular fa-clock fa-md" style={{ color: '#a7a7a7' }}></i>

                                </th>
                            </tr>
                        </thead>
                        <br />
                        <tbody>
                            {likedSongs.Tracks.map((item, index) => {
                                return (
                                    <tr onClick={(e) => playSongOnClick(TOKEN_FROM_LOCALSTORAGE, item.track.album.uri)} key={item.track.id} className='fontStyle likedSongTable' style={{ marginTop: '10px', borderRadius: '5px' }} >
                                        <td className='table_data'  >{index + 1}</td>

                                        <td style={{ display: 'flex', gap: '10px' }} className='table_data'  >
                                            <div style={{ cursor: 'pointer' }} >
                                                <img src={item.track.album.images[2].url} style={{ borderRadius: '5px' }} alt="" height={45} width={45} />
                                            </div>
                                            <div>
                                                <span className='fontStyle' style={{ display: 'block', color: 'white', fontSize: '16px', cursor: 'pointer' }} >{item.track.name.length > 39 ? item.track.name.slice(0, 38) + '...' : item.track.name} </span>
                                                <span className='fontStyle' style={{ color: '#a7a7a7', fontSize: '14px' }}> {item.track.artists.length == 3 ? item.track.artists[0].name + ', ' + item.track.artists[1].name : item.track.artists.length == 2 ? item.track.artists[0].name : item.track.artists.length == 4 ? item.track.artists[0].name + ', ' + item.track.artists[1].name : item.track.artists[0].name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='table_data albumRow' >
                                            <span className='fontStyle' style={{ fontSize: '14px', fontWeight: 400, color: '#a7a7a7' }} >{item.track.album.album_type !== "single" && item.track.album.name.length > 39 ? item.track.album.name.slice(0, 39) + '...' : item.track.album.name}</span>
                                        </td>
                                        <td className='table_data fontStyle' style={{ fontSize: '0.9rem' }} >{item.added_at}</td>
                                        <td className='table_data fontStyle' style={{ fontSize: '0.9rem' }} >{

                                            Math.floor(item.track.duration_ms / 60000) + ":" + (((item.track.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : '') + ((item.track.duration_ms % 60000) / 1000).toFixed(0)
                                        }
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

export default LikedSongs
