import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { artistDetails } from '../features/artists/ArtistsActions';
import { Link, useParams } from 'react-router-dom';
import { FaSpotify } from "react-icons/fa";
import { MapPin } from 'lucide-react';

function ArtistDetail() {
    const { name, spotify_id } = useParams();
    
    const [imgLoaded, setImgLoaded] = useState(false);

    const {selectedArtist} = useSelector(state=>state.artists)
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(artistDetails(spotify_id));
    },[])

    function formatFollowers(num) {
      if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
      } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
      return num.toString();
    }

    console.log(selectedArtist, 'selelee')
  return (
    <div className='flex flex-col md:flex-row sm:gap-6 pt-20 px-4 sm:px-11 md:px-16 lg:px-36'>
      <div className='h-1/2 md:w-3/4 md:h-[30rem] relative rounded overflow-hidden'>
        {!imgLoaded && (
          <div className="animate-pulse w-full bg-gray-700 rounded"></div>
        )}
        <img src={selectedArtist?.profile_pic} alt="" className={`w-full lg:h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImgLoaded(true)}/>
      </div>
      <div className='space-y-9 md:space-y-16 w-full mt-2 md:mt-9'>
          <div className='space-y-5 w-fit'>
            <h1 className='text-6xl sm:text-8xl'>{selectedArtist?.name}</h1>
            <div className='flex items-center justify-between'>
              <Link to={selectedArtist?.spotify_url} className='px-3'>
                <FaSpotify className='text-4xl text-green-500'/>
              </Link>
              <h1 className='text-light font-light'><span className='text-primary font-bold'>{selectedArtist?.followers ? formatFollowers(selectedArtist.followers) : '0'}<br/></span> Followers</h1>
            </div>
        </div>
        <div className='px-2 sm:px-5 md:px-9 w-full space-y-3'>
          <h1 className='text-3xl'>Genres</h1>
          <div className='grid grid-cols-2 gap-4'>
            {selectedArtist?.genres?.length>0 ?
              selectedArtist?.genres.map((genre, index)=>(
                <div key={index} className='bg-primary/90 py-2 text-center rounded text-xl font-bold cursor-pointer hover:bg-primary'>
                  {genre.name}
                </div>
              )) :
              <p>No Genres found</p>
            } 
          </div>
        </div>
        {selectedArtist?.location &&
          <div className='flex gap-2 items-center'>
            <MapPin className='text-gray-200'/>
            <h1 className='text-xl text-primary font-semibold'>{selectedArtist?.location}</h1>
          </div>
        }
      </div>
    </div>
  )
}

export default ArtistDetail
