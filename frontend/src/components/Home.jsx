import React, { useState } from 'react'
import SearchInput from './SearchInput'
import SuggestedArtists from './SuggestedArtists'
import PopularArtists from './PopularArtists'
import { useSelector } from 'react-redux'

function Home() {
  const {artists, popularArtists} = useSelector(state=>state.artists)
  const [search, setSearch] = useState('');

  return (
    <div className='px-36 pt-9 flex flex-col items-center relative'>
      <SearchInput search={search} setSearch={setSearch}/>
      {search && artists &&
        <SuggestedArtists artists={artists}/>
      }
      <PopularArtists />
    </div>
  )
}

export default Home
