import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Table from 'react-bootstrap/esm/Table';
import { useNavigate } from 'react-router-dom';



const Search = () => {

    const TOKEN_FROM_LOCALSTORAGE = localStorage.getItem('user_token')
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const navigate = useNavigate()



    const [category, setCategory] = useState([])


    useEffect(() => {
        if (TOKEN_FROM_LOCALSTORAGE != "") {
            searchPageAPI(TOKEN_FROM_LOCALSTORAGE)

        }
        else {
            navigate('/failed')
        }
        // console.log(category);

    }, [])
    const searchPageAPI = async (Token) => {
        // console.log('token from local store', Token);

        await axios.get("https://api.spotify.com/v1/browse/categories?country=IN&limit=50",
            {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            }
        ).then((response) => {
            setIsLoading(false)
            // console.log('SUCCESS_ON_LOAD', SUCCESS_ON_LOAD);
            // console.log('res from search', response);

            return setCategory(response.data.categories.items)

        }).catch((err) => {
            return console.log('err is ', err);
            // console.log('SUCCESS_ON_LOAD', SUCCESS_ON_LOAD);

        })
    }

    // Function to generate a random light color
    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    const convertToMinutes = (ms) => {
        const date = new Date(ms);
        return `${date.getMinutes()}:${date.getSeconds()}`
    }

    const fetchSearchResult = async () => {
        setIsLoading(true)


        if (TOKEN_FROM_LOCALSTORAGE) {
            await axios.get(`https://api.spotify.com/v1/search?q=${search}&type=track&market=IN&limit=10&include_external=audio`,
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN_FROM_LOCALSTORAGE}`,
                    },
                }
            ).then(async (response) => {
                // console.log('SUCCESS_ON_LOAD', SUCCESS_ON_LOAD);
                console.log('response data : ', response.data);
                await setSearchResults(response.data.tracks.items)
                setIsLoading(false)


            }).catch((err) => {
                return console.log('err is ', err);
                // console.log('SUCCESS_ON_LOAD', SUCCESS_ON_LOAD);

            })
        }
        else {
            navigate('/failed')
        }

    }

    // Generate an array of 50 objects

    const arrayOfObjects = Array.from({ length: 50 }, () => {
        return {
            background: generateRandomColor(),
        };
    });

    return (
        <main className='SearchMain2'  >



            {!isLoading && search.length === 0 ? <>
                <section style={{ marginTop: '90px' }} >
                    <h3 className='headingSearch'> Browse all </h3>
                </section>

                <section style={{ height: '0vh' }}>
                    <div className='browseAll-Section' >

                        {category && category.map((item, index) => {

                            return (
                                <a href="" className='box-dimension' style={arrayOfObjects[index]} key={item.id} >
                                    <span style={{ textTransform: 'capitalize' }}  >{item.name.toLowerCase()}</span>
                                    <div className='inner_Box_dimension' >
                                        <img loading='lazy' src={item.icons[0].url} alt="" height={'100px'} />
                                    </div>
                                </a>
                            )
                        })}

                    </div>
                </section>

            </> : isLoading ?
                <>
                    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '78vh', marginTop: '71px', fontFamily: 'sans-serif ' }} >
                        <div className='loader' ></div>
                    </section>
                </>
                : search.length > 0 && !isLoading ? <>
                    <section style={{ marginTop: '100px' }} >
                        <p style={{ width: '97%', margin: 'auto', fontSize: '25px', fontWeight: '600' }} >Match Results </p>
                        <Table style={{ width: '97%', margin: 'auto' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid' }} >
                                    <th style={{ width: '5%' }} className='table_heading'></th>

                                    <th style={{ width: '50%' }} className='table_heading'>Title</th>
                                    <th style={{ width: '35%' }} className='table_heading'>Album</th>
                                    <th className='table_heading' style={{ textAlign: 'center' }}>
                                        <i className="fa-regular fa-clock fa-md" style={{ color: '#a7a7a7' }}></i>
                                    </th>
                                </tr>
                            </thead>


                            <tbody>
                                {searchResults.map((item, index) => {
                                    return (
                                        <tr key={index}  >
                                            <td className='table_data' style={{ textAlign: 'center' }} >
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }} ></span>
                                            </td>

                                            <td style={{ display: 'flex', gap: '10px', cursor: 'pointer' }} className='table_data'  >
                                                <div>
                                                    <img src={item.album.images[1].url} alt="" height={45} width={45} />
                                                </div>
                                                <div>
                                                    <span style={{ display: 'block', color: 'white', fontSize: '16px' }} >{item.name} </span>
                                                    <span style={{ color: '#a7a7a7', fontSize: '14px', fontWeight: '600' }}> {item.album.artists.length == 1 ? item.album.artists[0].name : item.album.artists.map((artist, index) => {
                                                        return index <= 4 ? artist.name + ', ' : null
                                                    }
                                                    )}
                                                    </span>
                                                </div>

                                            </td>
                                            <td className='table_data'  >
                                                <span style={{ fontSize: '14px', fontWeight: 400, color: '#a7a7a7' }} >{item.album.name.length > 50 ? item.album.name.slice(0, 50) + '...' : item.album.name}</span>
                                            </td>
                                            <td className='table_data' style={{ fontSize: '14px', fontWeight: 400, color: '#a7a7a7', textAlign: 'center' }} >{convertToMinutes(item.duration_ms)}</td>
                                        </tr>
                                    )
                                })}

                            </tbody>


                        </Table>


                    </section>
                </> : null
            }




        </main>
    )
}

export default Search
