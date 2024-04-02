import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import PageRoutes from './PageRoutes'
import axios from 'axios'
import companyLogo from './spo.png';
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import loginImg from './Assets/Enjoying-Music.png'
import loginImg2 from './Assets/nobg.png'
import fetchSpotifyToken from './fetchSpotifyToken';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
// Redux
import { updatedisplayInfo } from './Redux/profile.js'

import { useDispatch, useSelector } from 'react-redux';
import ReturnParams from './api/ReturnParams.js';




const Login = () => {
    const dispatch = useDispatch();
    const API_URL = `http://localhost:5000`
    const navigate = useNavigate()
    const CLIENT_ID = '108736de212a46b481ebb34a1dad6c5f'
    const CLIENT_SECRET_ID = 'f1bc62c3a67d436abddf208aba722135'
    const SPOTIFY_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const SPOTIFY_ENDPOINT_API = 'https://accounts.spotify.com'

    const REDIRECT_URL_AFTER_LOGIN = 'http://localhost:3000/'
    const SPACE_DELIMITER = "%20";
    const SCOPE = ["streaming", "user-top-read", "user-modify-playback-state", "app-remote-control", "user-library-modify", "user-library-read", "user-read-recently-played", "user-read-playback-state", "user-read-email", "user-read-currently-playing", "playlist-modify-public", "user-read-private", "user-read-recently-played", "user-follow-read"]
    const SCOPES_URL_PARAM = SCOPE.join(SPACE_DELIMITER)
    //use Redux from store 
    const displayData = useSelector((state) => state.profile.displayInformation)

    useEffect(() => {

        fetchSpotifyData()


    }, [])

    async function fetchSpotifyData() {
        if (window.location.hash) {
            // console.log('hash is ', window.location.hash);
            const { access_token, expires_in, token_type } = await ReturnParams(window.location.hash)
            // toast('Authenticating in ..')
            const accessresult = { accesstoken: access_token, expiresin: expires_in, tokentype: token_type }
            // console.log('object token is ', accessresult);
            localStorage.setItem('user_token', access_token)

            await axios.get(`https://api.spotify.com/v1/me`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }).then(async (res) => {
                    // console.log(res)
                    localStorage.setItem('user_Id', res.data.id)

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
                    return navigate('/home')


                }).catch(err => console.log('err in get current user', err))
            // getCurrentUserPlaylist(access_token)
        }
    }


    const handleSpotifyLogin = (e) => {
        e.preventDefault()

        // Frontend fetch example
        window.location = `${SPOTIFY_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`


    }

    return (
        <>

            <header className='fontStyle' style={{ width: '100%', backgroundColor: 'black', height: '100px', display: 'flex' }} >
                <div style={{ width: '95%', margin: 'auto' }} >
                    <img src={companyLogo} alt="" width={'31px'} height={'32px'} style={{ position: 'relative', top: '-4px' }} />
                    <label htmlFor="home" style={{ fontSize: '24px', fontWeight: 500, paddingLeft: '5px' }} >Spotify</label>
                </div>
            </header>
            <section style={{ height: '86vh', backgroundColor: '#151515', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', gap: '20px' }} >
                <div style={{ width: '30%', backgroundColor: 'black', height: '40vh', borderRadius: '10px' }} >

                    <p style={{ fontSize: '38px', textAlign: 'center', fontWeight: '600', marginTop: '40px', marginBottom: '30px' }} >Log in to Spotify</p>
                    <hr style={{ width: '85%', margin: 'auto', marginBottom: '40px' }} />

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {/* <GoogleOAuthProvider clientId="764837297249-rost05cc7l60l73g11rqcohv73b9j4c2.apps.googleusercontent.com">
                            <GoogleLogin

                                onSuccess={handlegoogleLogin}
                                onFailure={(e) => { navigate('/failed') }}
                                theme='filled_black'
                                size='large'
                                text='continue_with'
                                type='standard'
                                shape='circle'
                                logo_alignment='left'
                                width={300}
                            />
                        </GoogleOAuthProvider> */}
                        <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }} >
                            {/* <button onClick={(e) => handleSpotifyLogin(e)} className='btn btn-info' >Login with Spotify</button> */}
                            <button onClick={(e) => handleSpotifyLogin(e)} type='submit' className='btn fontStyle loginBtn ' style={{ backgroundColor: 'rgb(30 214 96)', width: '100%', fontSize: '15px', borderRadius: '20px', height: '42px', color: 'black' }}>Login with Spotify</button>


                        </div>
                        <ToastContainer
                            position="top-center"
                            autoClose={2000}
                            hideProgressBar
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl={false}
                            pauseOnFocusLoss={false}
                            draggable
                            pauseOnHover={false}
                            theme="dark"
                            role="alert"
                        />
                    </div>

                    {/* <form style={{ height: '265px', display: 'flex', flexDirection: 'column', width: '58%', margin: 'auto' }} onSubmit={(e) => handleLoginOnSubmit(e)} >
                        <div>
                            <label htmlFor="email" className='login_label' style={{ fontSize: '13px' }} >Email or username</label>
                            <input type="text"
                                style={{ color: 'white', marginTop: '5px', borderRadius: '4px', fontSize: '15px', height: '45px', backgroundColor: '#121212', fontWeight: 400, width: '100%', border: '1px solid #9b9b9b', padding: '2px 0px 0px 10px' }}
                                placeholder='Email or username'
                                name='email'
                                className='login_label'
                                id='email'
                                onChange={(e) => setLoginCred({ ...loginCred, email: e.target.value })}
                                value={loginCred.email}
                                required={true}

                            />
                        </div>
                        <div>
                            <label className='login_label' style={{ fontSize: '13px', marginTop: '30px' }} htmlFor="password" >Password</label>
                            <input type="password"
                                style={{ color: 'white', marginBottom: '15px', marginTop: '5px', borderRadius: '4px', fontSize: '15px', height: '45px', backgroundColor: '#121212', fontWeight: 400, width: '100%', border: '1px solid #9b9b9b', padding: '2px 0px 0px 10px' }}
                                placeholder='Password'
                                className='login_label'

                                name='password'
                                id='password'
                                onChange={(e) => setLoginCred({ ...loginCred, password: e.target.value })}
                                value={loginCred.password}
                                required={true}


                            />
                        </div>

                        <div style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
                            <button type='submit' className='btn fontStyle ' style={{ backgroundColor: 'rgb(30 214 96)', width: '100%', fontSize: '15px', borderRadius: '20px', height: '42px', color: 'white' }}>Log In</button>
                        </div>

                    </form> */}
                    {/* <hr style={{ width: '85%', margin: 'auto', marginBottom: '25px', marginTop: '15px' }} />
                    <div style={{ textAlign: 'center', fontSize: '12px' }}>
                        <span className='fontStyle' style={{ color: '#8d8d8d' }} >Don't have an account? <span className='fontStyle' style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { navigate('/register') }}>Sign up for Spotify</span></span>

                    </div> */}

                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '25%' }}>
                    <img src={loginImg2} alt="noimg" height={335} width={330} />

                </div>


            </section>

        </>
    )
}

export default Login
