import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../axios/axios";
import { URLS } from "../services";

export const searchArtists = createAsyncThunk('searchArtists', async (_, {rejectWithValue})=>{
    try{
        const response = await axiosInstance.get(`${URLS["artists-search"]}?query=${_}`)
        return response.data;
    }catch(error){
        return rejectWithValue(error?.response?.data)
    }
})

export const popularArtistsAction = createAsyncThunk('popularArtists', async(page, {rejectWithValue})=>{
    try{
        const response = await axiosInstance.get(`${URLS["artists-popular"]}?page=${page}`)
        return response.data;
    }catch(error){
        return error?.response?.data
    }
});