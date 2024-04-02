import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { updatedisplayInfo } from './Redux/profile'
// import sampleImage from './images/sleep.jpeg'


const PlayList = () => {
    const Album_Id = useParams()
    const dispatch = useDispatch()
    var songData = useSelector((state) => state.songInfo.deviceInfo)
    var deviceData = useSelector((state) => state.deviceInfo.deviceInformation)


    const [playlists, setPlayLists] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const TOKEN_FROM_LOCALSTORAGE = localStorage.getItem('user_token')


    const displayData = useSelector((state) => state.profile.displayInformation);


    useEffect(() => {

        const TOKEN_FROM_LOCALSTORAGE = localStorage.getItem('user_token')
        // console.log(Album_Id);

        fetchPlaylistById(TOKEN_FROM_LOCALSTORAGE, Album_Id)
        // currentUser(TOKEN_FROM_LOCALSTORAGE)
    }, [Album_Id])

    const fetchPlaylistById = async (Token, PlaylistID) => {
        // console.log('Token is ', Token);

        await axios.get(`https://api.spotify.com/v1/playlists/${PlaylistID.id}`,
            {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }
        )
            .then(async (response) => {
                // console.log('track list ', response);
                await setPlayLists({
                    TotalSong: response.data.tracks.total,
                    Name: response.data.name,
                    Description: response.data.description,
                    Type: response.data.type,
                    PlaylistID: response.data.id,
                    CoverImage: response.data.images[0].url,
                    Tracks: response.data.tracks,
                    Context_uri: response.data.uri
                })
                return await setIsLoading(false)

            })
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
        <  >
            {!isLoading ? <>
                {/* <div className='playlist_outerBox' > */}
                <section className='playlist_Top_Section'  >
                    <div className='image_Box' >
                        <img src={playlists.CoverImage} alt="" height={'230px'} width={'220px'} style={{ margin: '70px 10px 0px 20px', borderRadius: '10px' }} />
                    </div>
                    <div className='content_Box' >
                        <div className='content_Box_inside' >
                            <span className='fontStyle' style={{ textTransform: 'capitalize', fontSize: '14px' }}>{playlists.Type}</span>
                            <span className='fontStyle' style={{ height: '50%', fontSize: '80px', fontWeight: '600', marginTop: '0', marginBottom: 0 }} >{playlists.Name}</span>
                            <span className='fontStyle' style={{ fontWeight: '400', color: '#a7a7a7', fontSize: '14px' }} >{playlists.Description}</span>
                            <ul style={{ marginLeft: '-3%', display: 'flex', alignItems: 'center', fontSize: '14px', marginTop: '10px' }} key={playlists.PlaylistID} >
                                <li style={{ cursor: 'pointer', display: 'flex', margin: '10px 40px 10px 10px', justifyContent: 'center', alignItems: 'center' }} >
                                    <img height={35} style={{ borderRadius: '50%' }} src={displayData.profilepic} alt="" />
                                </li>
                                <li style={{ listStyle: 'none' }}  >{playlists.Tracks.total} songs</li>
                            </ul>
                        </div>
                    </div>

                </section>
                <section style={{ marginTop: '20px', height: '50px', width: '96%', margin: '20px auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                    <button onClick={() => { playSongOnClick(TOKEN_FROM_LOCALSTORAGE, playlists.Context_uri) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '85%', width: '4%', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%' }}  >
                        <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px' }}></i>
                    </button>
                </section>
                <section>
                    <Table style={{ width: '95%', margin: 'auto' }} hover >
                        <thead>
                            <tr style={{ borderBottom: '1px solid' }} >
                                <th style={{ width: '3%', fontWeight: '100 ' }} className='table_heading'>#</th>
                                <th style={{ width: '39%', fontWeight: '100 ' }} className='table_heading'>Title</th>
                                <th style={{ width: '32%', fontWeight: '100 ' }} className='table_heading'>Album</th>
                                <th style={{ width: '20%', fontWeight: '100 ' }} className='table_heading'>Release date</th>
                                <th className='table_heading'>
                                    <i className="fa-regular fa-clock fa-md" style={{ color: '#a7a7a7' }}></i>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {playlists.Tracks.items.map((item, index) => {
                                return (
                                    <tr key={index} className='fontStyle likedSongTable' style={{ marginTop: '10px', borderRadius: '5px' }} >
                                        <td className='table_data'  >{index + 1}</td>

                                        <td style={{ display: 'flex', gap: '10px' }} className='table_data'  >
                                            <div style={{ cursor: 'pointer' }} >
                                                <img src={item.track.album.images[1].url} style={{ borderRadius: '5px' }} alt="" height={45} width={45} />
                                            </div>
                                            <div>
                                                <span className='fontStyle' style={{ display: 'block', color: 'white', fontSize: '16px', cursor: 'pointer' }} >{item.track.name} </span>
                                                <span className='fontStyle' style={{ color: '#a7a7a7', fontSize: '14px' }}> {item.track.artists.length == 3 ? item.track.artists[0].name + ', ' + item.track.artists[1].name : item.track.artists.length == 2 ? item.track.artists[0].name : item.track.artists.length == 4 ? item.track.artists[0].name + ', ' + item.track.artists[1].name : item.track.artists[0].name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='table_data albumRow' >
                                            <span style={{ fontSize: '14px', color: '#a7a7a7' }} >{item.track.album.name.length > 35 ? item.track.album.name.slice(0, 35) + '...' : item.track.album.name}</span>
                                        </td>
                                        <td className='table_data' style={{ fontSize: '0.9rem' }} >{item.track.album.release_date}</td>
                                        <td className='table_data' style={{ fontSize: '0.9rem' }} >
                                            {Math.floor(item.track.duration_ms / 60000) + ":" + (((item.track.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : '') + ((item.track.duration_ms % 60000) / 1000).toFixed(0)}
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

export default PlayList
