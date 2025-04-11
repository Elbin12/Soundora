import { createSlice } from "@reduxjs/toolkit";
import { artistDetails, popularArtistsAction, searchArtists } from "./ArtistsActions";
import { handlePending, handleRejected } from "../utils";


const initialState = {
    'artists': [],
    'popularArtists':[],
    'selectedArtist': {},
    'isSearch':false,
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
        },
        setIsSearch: (state, action)=>{
            state.isSearch = action.payload;
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
            const uniqueArtists = [
                ...new Map(
                  [...state.popularArtists, ...action.payload.results].map(artist => [artist.id, artist])
                ).values()
              ];
              
            state.popularArtists = uniqueArtists;
        })

        .addCase(artistDetails.pending, handlePending)
        .addCase(artistDetails.rejected, handleRejected)
        .addCase(artistDetails.fulfilled, (state, action)=>{
            state.success = true;
            state.loading = false;
            state.selectedArtist = action?.payload;
        })
    }
})

export const {setArtists, setIsSearch} = artistsSlice.actions
export default artistsSlice.reducer