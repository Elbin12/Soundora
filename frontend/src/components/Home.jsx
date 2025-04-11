import React, { useState } from 'react'
import SearchInput from './SearchInput'
import SuggestedArtists from './SuggestedArtists'
import PopularArtists from './PopularArtists'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../features/artists/ArtistsSlice'

function Home() {
  const {artists, popularArtists, isSearch} = useSelector(state=>state.artists)
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();

  return (
    <div className='sm:px-11 md:16 lg:px-36 pt-24 flex flex-col items-center relative' onClick={()=>dispatch(setIsSearch(false))}>
      <SearchInput search={search} setSearch={setSearch}/>
      {isSearch && search &&
        <SuggestedArtists artists={artists}/>
      }
      <PopularArtists />
    </div>
  )
}

export default Home
