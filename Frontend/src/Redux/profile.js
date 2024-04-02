import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({

    name: 'spotifyProfile',
    initialState: {
        displayInformation: {}
    },
    reducers: {
        updatedisplayInfo: (state, { payload }) => {
            state.displayInformation = payload
        }
    }

})
export const { updatedisplayInfo } = profileSlice.actions;
export default profileSlice.reducer;