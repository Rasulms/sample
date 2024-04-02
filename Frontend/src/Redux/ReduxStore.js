import { configureStore } from '@reduxjs/toolkit'
import ProfileInfoFromSlice from './profile.js';
import SongInfo from './SongInfo.js';
import DeviceInfo from './device.js'

const ReduxStore = configureStore({
    reducer: {
        profile: ProfileInfoFromSlice,
        songInfo: SongInfo,
        deviceInfo: DeviceInfo

    }
})


export default ReduxStore
