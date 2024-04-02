import { createSlice } from '@reduxjs/toolkit'

export const device = createSlice({

    name: 'spotifyProfile',
    initialState: {
        deviceInformation: {}
    },
    reducers: {
        updatedeviceInfo: (state, { payload }) => {
            state.deviceInformation = payload
        }
    }

})
export const { updatedeviceInfo } = device.actions;
export default device.reducer;