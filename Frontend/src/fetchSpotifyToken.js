
const fetchSpotifyToken = async () => {
    const spotify_client_id = '108736de212a46b481ebb34a1dad6c5f'

    const spotify_client_secret = 'f1bc62c3a67d436abddf208aba722135'

    var authParameter = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + spotify_client_id + '&client_secret=' + spotify_client_secret
    }

    const ACCESS_TOKEN = await fetch('https://accounts.spotify.com/api/token', authParameter)
        .then((response) => response.json())
        .then(res => res.access_token)
        .catch(err => console.log('err is ', err));

    // console.log('TOKEN FROM APP.JS', ACCESS_TOKEN);

    return await ACCESS_TOKEN
    // await setToken(ACCESS_TOKEN)
}

export default fetchSpotifyToken
