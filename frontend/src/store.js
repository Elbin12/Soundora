import { configureStore } from "@reduxjs/toolkit";
import artistsReducer from './features/artists/artistsSlice'

const store = configureStore({
    reducer: {
        artists: artistsReducer
    }
})

export default store