import React, { useEffect, useState } from 'react'
import verified from './Assets/verify.png'
import Table from 'react-bootstrap/Table'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import samp from './Album Cover/Yuvan5.jpeg'
import { useSelector } from 'react-redux';


const ArtistPage = () => {
    const USER_TOKEN = localStorage.getItem('user_token');
    var songData = useSelector((state) => state.songInfo.songInformation)
    var deviceData = useSelector((state) => state.deviceInfo.deviceInformation)


    const Artist_Id = useParams()
    const [artist, setArtist] = useState({
        name: '', image: '', followers: '', context_uri: ''
    })
    const [artistSongs, setArtistSongs] = useState()



    useEffect(() => {
        const searchHeader = document.getElementsByClassName('SearchMain')

        if (USER_TOKEN) {
            getArtistById(USER_TOKEN, Artist_Id)
            getArtistTopTracks(USER_TOKEN, Artist_Id)
        }


    }, [Artist_Id])

    const getArtistById = async (TOKEN, ARTIST_ID) => {
        // console.log('artist id', ARTIST_ID.id);
        await axios.get(`https://api.spotify.com/v1/artists/${ARTIST_ID.id}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }).then((res) => {
                setArtist({
                    name: res.data.name, image: res.data.images[1].url, followers: res.data.followers.total, context_uri: res.data.uri
                })
            }
            ).catch(err => console.log('artists details api', err))

    }
    const playSongOnClick = async (TOKEN, CONTEXT_URI) => {
        // console.log('hello');
        console.log(CONTEXT_URI);
        const DEVICE_ID = deviceData.device_id
        // console.log('from play song on click', DEVICE_ID);
        // console.log('from play song on click token', TOKEN);


        const data = {
            "context_uri": CONTEXT_URI,
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
                // console.log('FETCH Success:', responseData);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }

    }

    const getArtistTopTracks = async (TOKEN, ARTIST_ID) => {
        // console.log('artist id', ARTIST_ID.id);
        await axios.get(`https://api.spotify.com/v1/artists/${ARTIST_ID.id}/top-tracks?market=IN`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }).then((res) => {
                // console.log(res);

                setArtistSongs(res.data.tracks)
            }
            ).catch(err => console.log('artists top tracks api', err))

    }
    return (
        <>
            <section className='artistPageOuter' >
                <div className='image_Box' style={{ paddingTop: '3%', backgroundColor: 'linear-gradi' }} >
                    <img src={artist.image} alt="" height={'200px'} width={'200px'} style={{ margin: '70px 10px 35px 20px', borderRadius: '50%' }} />
                </div>
                <div style={{ maxHeight: '50vh', height: '46vh', width: '100%', paddingTop: '11%', paddingLeft: '22px' }}>
                    <span className='fontStyle' style={{ display: 'block' }} ><img src={verified} height={25} width={25} alt="Verified" style={{ marginRight: '10px' }} />Verified Artist</span>
                    <span style={{ display: 'block', fontSize: '85px', fontWeight: '600', height: '61%' }} className='fontStyle'>{artist.name}</span>
                    <span className='fontStyle' style={{ display: 'block' }} >{artist.followers} followers</span>

                </div>
            </section>
            <section style={{ marginTop: '20px', height: '50px', width: '96%', margin: '20px auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                <button onClick={() => { playSongOnClick(USER_TOKEN, artist.context_uri) }} className='likedsongPlaybtn btn justify-content-center align-items-center' style={{ borderRadius: '50%', height: '85%', width: '4%', backgroundColor: '#1fdf64', display: 'flex', fontSize: '107%' }}  >
                    <i className="fa-solid fa-play" style={{ color: '#000000', marginLeft: '3px' }}></i>
                </button>
            </section>
            <section style={{ paddingLeft: '22px', marginTop: '15px' }} >
                <span className='fontStyleBold' style={{ fontSize: '25px' }} >Popular</span>
                <Table style={{ width: '96%', margin: 'auto', marginTop: '5px' }} hover >
                    <tbody>
                        {artistSongs ? artistSongs.map((song, index) => {
                            return (
                                <tr key={song.id} className='fontStyle' style={{ borderRadius: '5px' }} >
                                    <td className='table_data' style={{ width: '4%' }}  >
                                        {
                                            index + 1
                                        }
                                    </td>

                                    <td style={{ display: 'flex', gap: '10px', width: '100%' }} className='table_data'  >
                                        <div style={{ cursor: 'pointer' }} >
                                            <img src={song.album.images[1].url} style={{ borderRadius: '5px' }} alt="" height={45} width={45} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }} >
                                            <span className='fontStyle' style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }} >{song.name} </span>

                                        </div>
                                    </td>
                                    <td className='table_data albumRow' style={{ width: '40%' }} >
                                        <span style={{ fontSize: '14px', color: '#a7a7a7' }} >{song.album.name.length > 40 ? song.album.name.slice(0, 40) + '...' : song.album.name
                                        }</span>
                                    </td>
                                    <td className='table_data' style={{ fontSize: '0.9rem', width: '15%' }} >
                                        {Math.floor(song.duration_ms / 60000) + ":" + (((song.duration_ms % 60000) / 1000).toFixed(0) < 10 ? '0' : '') + ((song.duration_ms % 60000) / 1000).toFixed(0)}
                                    </td>

                                </tr>
                            )
                        }) : 'no Songs Found'}

                    </tbody>
                </Table>
            </section>
        </>
    )
}

export default ArtistPage
