import { createSlice } from '@reduxjs/toolkit'

export const SongInfo = createSlice({

    name: 'spotifySongInformation',
    initialState: {
        songInformation: {
            // name: '',
            // artists: '',
            // thumbImage: ''
        }
    },
    reducers: {
        updatesongInformation: (state, { payload }) => {
            state.songInformation = payload
        }
    }

})
export const { updatesongInformation } = SongInfo.actions;
export default SongInfo.reducer;