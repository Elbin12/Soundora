import { createSlice } from "@reduxjs/toolkit";
import { popularArtistsAction, searchArtists } from "./ArtistsActions";
import { handlePending, handleRejected } from "../utils";


const initialState = {
    'artists': [],
    'popularArtists':[],
    'success': false,
    'loading': false,
    'error': '',
    'message': ''
}

const artistsSlice = createSlice({
    name:'slice',
    initialState: initialState,
    reducers:{
        setArtists: (state, action)=>{
            state.artists = action?.payload;
        }
    },
    extraReducers(builder){
        builder
        .addCase(searchArtists.pending, handlePending)
        .addCase(searchArtists.rejected, handleRejected)
        .addCase(searchArtists.fulfilled, (state, action)=>{
            state.loading = false;
            state.success = true;
            state.artists = action?.payload
        })

        .addCase(popularArtistsAction.pending, handlePending)
        .addCase(popularArtistsAction.rejected, handleRejected)
        .addCase(popularArtistsAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.success = true;
            state.popularArtists = [...state.popularArtists, ...action?.payload.results];
        })
    }
})

export const {setArtists} = artistsSlice.actions
export default artistsSlice.reducer