import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateDeviceInfo, updatesongInformation } from './Redux/SongInfo';
import axios from 'axios';
import { updatedeviceInfo } from './Redux/device';


const WebPlayback = (props) => {
  const dispatch = useDispatch()
  var songData = useSelector((state) => state.songInfo.songInformation)
  var deviceData = useSelector((state) => state.deviceInfo.deviceInformation)
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);



  // var deviceInfo = useSelector((state) => state.songInfo.songInformation)

  const displayData = useSelector((state) => state.profile.displayInformation);
  var USERTOKEN = localStorage.getItem('user_token')

  // console.log(displayData);

  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(true);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState();


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);
    let token = localStorage.getItem('user_token')



    window.onSpotifyWebPlaybackSDKReady = async () => {
      const player = await new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });
      setPlayer(player);
      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        } else {
          console.error('Failed to connect to the Spotify Web Playback SDK');
        }
      }).catch(error => {
        console.error('Error connecting to the Spotify Web Playback SDK:', error);
      });

      player.addListener('ready', async ({ device_id }) => {
        const currentInfo = {
          device_id: device_id,
        }
        console.log('Device ID is Online & device id stored in reduxxx', device_id);
        setActive(true)

        await dispatch(updatedeviceInfo(currentInfo))

      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });





      player.addListener('player_state_changed', state => {

        if (props.disconnectPlayer) {
          player.disconnect()
        }

        if (!state) {
          return
        }
        console.log('state is changed ', state);

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        // var current_track = playerState.track_window.current_track;
        // var next_track = playerState.track_window.next_tracks[0];
        const playerState = state
        if (playerState && playerState.track_window.current_track !== null) {
          var artists = '';


          if (playerState.track_window.current_track.artists.length === 1) {
            artists = playerState.track_window.current_track.artists[0].name
          }
          else if (playerState.track_window.current_track.artists.length === 2) {
            artists = `${playerState.track_window.current_track.artists[0].name}, ${playerState.track_window.current_track.artists[1].name}`

          }
          else {
            artists = `${playerState.track_window.current_track.artists[0].name}, ${playerState.track_window.current_track.artists[1].name}, ${playerState.track_window.current_track.artists[2].name}`

          }
          const currentInfo = {

            name: playerState.track_window.current_track.name,
            artist: artists,
            thumbImage: playerState.track_window.current_track.album.images[0].url,
            type: playerState.track_window.current_track.type,
            song_id: playerState.track_window.current_track.id,
            song_duration: playerState.track_window.current_track.duration_ms,

          }
          // console.log('deviceid from redux ', songData);
          // console.log('currentinfo', currentInfo);
          return dispatch(updatesongInformation(currentInfo))
        }
        else {
          getPlayerInfo(USERTOKEN)
        }
      });

    }
  }, [props.disconnectPlayer]
  )

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
          // var deviceInfo = res.data.device;
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
            device_id: deviceData.device_id,
            song_duration: playingSongs.duration_ms,
            progress_ms: playingSongs.progress_ms

          }
          //     console.log('display', res.data);
          return dispatch(updatesongInformation(currentInfo))

        }
      }
      ).catch(err => console.log('err in playerInfo', err))


  }


  const handlePause = async (USERTOKEN, device_id) => {

    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${USERTOKEN}`,
      }
    }).then(res => console.log('Paused')).catch(err => console.log('Error in pausing song ', err))
  }
  const handlePlay = async (USERTOKEN, device_id) => {

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${USERTOKEN}`,
      }
    }).then(res => console.log('Resumed')).catch(err => console.log('Error in playing song ', err))
  }
  // const handlePlay = () => {
  //   player.resume().then(() => {
  //     setPaused(false)
  //     console.log('resumed!');
  //   });
  // }
  const handleDisconnectPlayer = () => {
    setPaused(true)
    setActive(false)
    player.disconnect().then(() => console.log('player disconnected'))


  }

  const handleNext = async (USER_TOKEN, device_id) => {
    await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${device_id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      }
    });
    // getPlayerInfo(USER_TOKEN)

  }

  const handlePrevious = async (USER_TOKEN, device_id) => {
    await fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${device_id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
      }
    });
    // getPlayerInfo(USER_TOKEN)
  }
  const handleShuffle = async (e, USER_TOKEN, btn_type) => {
    console.log(btn_type);

    if (btn_type === 'Shuffle') {
      await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=false&device_id=${deviceData.device_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${USER_TOKEN}`,
        }
      });
      setShuffle(false)
    }
    else {
      await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=${deviceData.device_id}`, {
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
      await fetch(`https://api.spotify.com/v1/me/player/repeat?state=off&device_id=${deviceData.device_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${USER_TOKEN}`,
        }
      });
      setRepeat(false)
    }
    else {
      await fetch(`https://api.spotify.com/v1/me/player/repeat?state=context&device_id=${deviceData.device_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${USER_TOKEN}`,
        }
      });
      setRepeat(true)
    }

  }
  // console.log(props.token);
  return (
    <>
      {is_active && displayData.product == 'premium' ? <div id='webPlayer' style={{ width: '32%', height: '9vh', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1%', width: '100%', height: '5vh' }} >

          <div style={{ width: '7%', display: 'flex', alignItems: 'center' }} >
            {!shuffle && <button onClick={(e) => { handleShuffle(e, USERTOKEN, 'noShuffle') }} className='shufflebtn' style={{ backgroundColor: 'black', border: 'none', width: '100%', height: '4.5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'start' }} >
              <i className="fa-solid fa-shuffle fa-md" style={{ color: '#a7a7a7', padding: '1px 0px 0px 0px' }}></i>
            </button>}
            {shuffle && <button onClick={(e) => handleShuffle(e, USERTOKEN, 'Shuffle')} className='shufflebtn' style={{ backgroundColor: 'black', border: 'none', width: '100%', height: '4.5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'start' }} >
              <i className="fa-solid fa-shuffle fa-md" style={{ color: '#1fde64', padding: '1px 0px 0px 0px' }}></i>
            </button>}

          </div>
          <div style={{ width: '7%', display: 'flex', alignItems: 'center' }} >
            <button onClick={() => { handlePrevious(USERTOKEN, deviceData.device_id) }} className='nextbtn' style={{ backgroundColor: 'black', border: 'none', width: '100%', height: '4.5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'start' }} >
              <i className="fa-solid fa-backward-step fa-md" style={{ color: '#a7a7a7', padding: '1px 0px 0px 0px' }}></i>
            </button>
          </div>
          <div style={{ width: '7.5%', display: 'flex', alignItems: 'center' }} >
            {!is_paused ? <button className='btn btn-light' style={{ backgroundColor: 'white', width: '100%', height: '5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => { handlePause(USERTOKEN, deviceData.device_id) }}>
              <i className="fa-solid fa-pause fa-lg" style={{ color: 'black', padding: '0px 0px 0px 1px' }} ></i>
            </button> :
              <button className='btn btn-light' style={{ backgroundColor: 'white', width: '100%', height: '5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { handlePlay(USERTOKEN, deviceData.device_id) }}>
                <i className="fa-solid fa-play fa-md" style={{ color: 'black', padding: '1px 0px 0px 2px' }} ></i>
              </button>}
            {/* {props.isPlaying == false && <button className='btn btn-light' style={{ backgroundColor: 'white', width: '100%', height: '5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { props.handlePlayPause(e, 'Play', props.token) }}>
              <i className="fa-solid fa-play fa-md" style={{ color: 'black', padding: '1px 0px 0px 2px' }} ></i>
            </button>} */}
          </div>
          <div style={{ width: '7%', display: 'flex', alignItems: 'center' }} >
            <button onClick={() => { handleNext(USERTOKEN, deviceData.device_id) }} className='nextbtn' style={{ backgroundColor: 'black', border: 'none', width: '100%', height: '4.5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'end' }} >
              <i className="fa-solid fa-forward-step fa-md" style={{ color: '#a7a7a7', padding: '1px 0px 0px 0px' }}></i>
            </button>
          </div>
          <div style={{ width: '7%', display: 'flex', alignItems: 'center' }} >
            {!repeat && <button onClick={(e) => { handleRepeat(e, USERTOKEN, 'norepeat') }} className='nextbtn' style={{ backgroundColor: 'black', border: 'none', width: '100%', height: '4.5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'end' }} >
              <i className="fa-solid fa-repeat fa-md" style={{ color: '#a7a7a7', padding: '1px 0px 0px 0px' }}></i>
            </button>}
            {repeat && <button onClick={(e) => { handleRepeat(e, USERTOKEN, 'repeat') }} className='nextbtn' style={{ backgroundColor: 'black', border: 'none', width: '100%', height: '4.5vh', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'end' }} >
              <i className="fa-solid fa-repeat fa-md" style={{ color: '#1fde64', padding: '1px 0px 0px 0px' }}></i>
            </button>}
          </div>
        </div>
        <div style={{ height: '3vh' }}>

        </div>
      </div> :
        is_active && displayData.product == 'free' ?
          <div style={{ width: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span className='fontStyle'>Premium subscription required for the player ! </span>

          </div>
          : <div style={{ width: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span className='fontStyle'>Player is getting ready </span>
            <span className='playerLoader fontStyle'>
            </span>
          </div>}
      {/* <button onClick={() => { getPlayerInfo(USERTOKEN) }} >disconnect</button> */}


    </>
  )
}

export default WebPlayback
