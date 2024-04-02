import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import companyLogo from './spo.png';
import SignupImage1 from './Assets/signup1.png'
import SignupImage2 from './Assets/signup2.png'
import SignupImage3 from './Assets/signup3.png'


import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';



const Register = () => {
    const API_URL = `http://localhost:5000`
    const navigate = useNavigate()
    const [SignupCred, setSignupCred] = useState({ username: '', email: '', password: '' })

    // useEffect(() => {
    //     fetchSpotifyToken().then((res) => {
    //         localStorage.setItem('USER-TOKEN', res)
    //         return setToken(res)
    //     }).catch(err => console.log(err))
    // }, [])
    const handleSignupOnSubmit = (e) => {
        e.preventDefault();
        if (SignupCred.email === "" || SignupCred.password === "" || SignupCred.username === "") {
            alert("Please enter username, password, username")
            return;
        }
        axios.post(`${API_URL}/api/register`, SignupCred).then(response => alert(response)).catch(err => console.log('err in login api', err))

    }


    const handleClick = async () => {
        // Redirect to home page after login.
        // navigate('/home')
    }
    return (
        <>
            <header className='fontStyle' style={{ width: '100%', backgroundColor: 'black', height: '100px', display: 'flex' }} >
                <div style={{ width: '95%', margin: 'auto' }} >
                    <img src={companyLogo} alt="" width={'31px'} height={'32px'} style={{ position: 'relative', top: '-4px' }} />
                    <label htmlFor="home" style={{ fontSize: '24px', fontWeight: 500, paddingLeft: '5px' }} >Spotify</label>
                </div>
            </header>
            <section style={{ height: '85vh', backgroundColor: '#151515', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', gap: '20px' }} >
                <div style={{ display: 'flex', justifyContent: 'center', width: '25%' }}>
                    <img style={{ transition: '10ms linear' }} src={SignupImage1} alt="noimg" height={300} width={300} />

                </div>

                <div style={{ width: '32%', backgroundColor: 'black', height: '80vh', borderRadius: '10px' }} >
                    <p style={{ fontSize: '35px', textAlign: 'center', fontWeight: '600', marginTop: '15px', marginBottom: '15px' }} >Sign up to start <br /> listening</p>

                    {/* <hr style={{ width: '85%', margin: 'auto', marginBottom: '20px', marginTop: '30px' }} /> */}


                    <form style={{ display: 'flex', flexDirection: 'column', width: '58%', margin: 'auto' }} onSubmit={(e) => handleSignupOnSubmit(e)} >

                        <div>
                            < label htmlFor="username" className='login_label' style={{ fontSize: '13px' }} >Username</label>
                            <input type="text"
                                style={{ color: 'white', marginTop: '5px', borderRadius: '4px', fontSize: '15px', height: '45px', backgroundColor: '#121212', fontWeight: 400, width: '100%', border: '1px solid #9b9b9b', padding: '2px 0px 0px 10px' }}
                                placeholder='Username'
                                name='username'
                                className='login_label'
                                id='username'
                                onChange={(e) => setSignupCred({ ...SignupCred, username: e.target.value })}
                                value={SignupCred.username}
                                required={true}

                            />
                        </div>


                        <div>
                            <label htmlFor="email" className='login_label' style={{ fontSize: '13px', marginTop: '15px' }} >Email address</label>
                            <input type="text"
                                style={{ color: 'white', marginTop: '5px', borderRadius: '4px', fontSize: '15px', height: '45px', backgroundColor: '#121212', fontWeight: 400, width: '100%', border: '1px solid #9b9b9b', padding: '2px 0px 0px 10px' }}
                                placeholder='Email '
                                name='email'
                                className='login_label'
                                id='email'
                                onChange={(e) => setSignupCred({ ...SignupCred, email: e.target.value })}
                                value={SignupCred.email}
                                required={true}

                            />
                        </div>

                        <div>
                            <label className='login_label' style={{ fontSize: '13px', marginTop: '15px' }} htmlFor="password">Password</label>
                            <input type="password"
                                style={{ color: 'white', marginBottom: '15px', marginTop: '5px', borderRadius: '4px', fontSize: '15px', height: '45px', backgroundColor: '#121212', fontWeight: 400, width: '100%', border: '1px solid #9b9b9b', padding: '2px 0px 0px 10px' }}
                                placeholder='Password'
                                className='login_label'

                                name='password'
                                id='password'
                                onChange={(e) => setSignupCred({ ...SignupCred, password: e.target.value })}
                                value={SignupCred.password}
                                required={true} />
                        </div>

                        <div style={{ width: '100%', textAlign: 'center', margin: 'auto', marginTop: '15px' }}>
                            < button type='submit' className='btn fontStyle ' style={{ backgroundColor: 'rgb(30 214 96)', width: '100%', fontSize: '15px', borderRadius: '20px', height: '42px', color: 'white' }}>Sign Up</button>
                            {/* <Button style={{ height: '30px', fontSize: '12px', backgroundColor: 'transparent', border: 'none', marginLeft: '5px', color: 'black' }} onClick={() => setLoginModalIsOpen(!loginModalIsOpen)}>Cancel</Button> */}
                        </div>

                    </form>
                    <hr style={{ width: '85%', margin: 'auto', marginBottom: '15px', marginTop: '10px' }} />
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <GoogleOAuthProvider clientId="764837297249-rost05cc7l60l73g11rqcohv73b9j4c2.apps.googleusercontent.com">
                            <GoogleLogin

                                // onSuccess={handlegoogleLogin}
                                onFailure={(e) => { navigate('/failed') }}
                                theme='filled_black'
                                size='large'
                                text='continue_with'
                                type='standard'
                                shape='circle'
                                logo_alignment='left'
                                width={300}
                            />
                        </GoogleOAuthProvider>
                    </div>
                    <hr style={{ width: '85%', margin: 'auto', marginBottom: '15px', marginTop: '15px' }} />
                    <div style={{ textAlign: 'center', fontSize: '12px' }}>
                        <span className='fontStyle' style={{ color: '#8d8d8d' }} >Already have an account? <span className='fontStyle' style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { navigate('/') }}>Log in here</span></span>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Register
