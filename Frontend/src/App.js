import React, { useEffect, useState } from 'react';
import './App.css';
import Button from './Button';
import PageRoutes from './PageRoutes';
import companyLogo from './spo.png';
// import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'


// import SpotifyPlayer from 'react-spotify-player';


function App() {


  const [category, setCategory] = useState([])
  const [token, setToken] = useState('')


  useEffect(() => {


  }, [])



  return (
    <main >
      <PageRoutes />
    </main>

  )
}

export default App;






