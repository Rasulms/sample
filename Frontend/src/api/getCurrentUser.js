// import axios from 'axios'
// import { useDispatch } from 'react-redux';
// import { updatedisplayInfo } from '../Redux/profile';
// import { useEffect } from 'react';



// const getCurrentUser = () => {
//     const dispatch = useDispatch();
//     const USER_TOKEN = localStorage.getItem('user_token')


//         async function currentUser(USER_TOKEN) {
//             console.log('in getcurrent user');
//             await axios.get(`https://api.spotify.com/v1/me`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${USER_TOKEN}`,
//                     },
//                 }).then(async (res) => {
//                     // console.log(res)
//                     const DisplayInfo = await {
//                         username: res.data.display_name,
//                         profilepic: res.data.images.length > 0 ? res.data.images[0].url : '',
//                         SpotifyUserID: res.data.id,
//                         domain: 'spotify.com',
//                         show: true,
//                         product: res.data.product,
//                         type: res.data.type

//                     }
//                     // console.log('DisplayInfo', DisplayInfo);
//                     await dispatch(updatedisplayInfo(DisplayInfo))
//                 }).catch(err => console.log('err in get current user in home page', err))
//         }


// }

// export default getCurrentUser;
