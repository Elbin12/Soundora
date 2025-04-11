import React, { useEffect, useState } from 'react'
import { Search, CircleX } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { searchArtists } from '../features/artists/ArtistsActions';
import { setArtists } from '../features/artists/ArtistsSlice';


    function SearchInput({search, setSearch}) {

        const dispatch = useDispatch();

        useEffect(() => {
            const timer = setTimeout(() => {
                dispatch(searchArtists(search));
            }, 500);
        
            return () => clearTimeout(timer);
          }, [search, dispatch]);

    return (
        <div className={`border-2 rounded-md w-3/4 flex gap-9 py-3 px-3 items-center ${search&&'border-light'}`}>
            <Search className={`${search&& 'text-light'}`} size={35}/>
            <input placeholder='search artists by name' type="text" className={`${search&& 'underline'} bg-transparent outline-none w-full text-lg text-light`} value={search} onChange={(e)=>setSearch(e.target.value)}/>
            <div>
                {search &&
                    <CircleX className='text-light cursor-pointer hover:text-gray-200' size={20} onClick={()=>{setSearch(''); dispatch(setArtists([]))}}/>
                }
            </div>
        </div>
    )
    }

    export default SearchInput
