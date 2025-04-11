import React, { useEffect, useState } from 'react';
import { popularArtistsAction } from '../features/artists/ArtistsActions';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { useNavigate } from 'react-router-dom';


function PopularArtists() {
  const dispatch = useDispatch();
  const { popularArtists, success, loading } = useSelector(state => state.artists);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    768: 2,
    500: 1
  };
  
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(popularArtistsAction(page));
  }, [dispatch, page]);

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

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  

  return (
    <div className="mt-24 w-full px-4">
        <h2 className="text-2xl font-bold mb-6 text-[#DC7F9B]">Popular Artists</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
        >
        {popularArtists?.map((artist, index) => (
            <div key={index} className="mb-4 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-secondary/10 group" onClick={()=>{navigate(`artist/${artist.name}/${artist.spotify_id}`)}}>
              <div className="relative">
                  <img 
                  src={artist.profile_pic} 
                  className="w-full object-cover" 
                  alt={artist.name}
                  style={{ 
                      height: `${Math.floor(200 + Math.random() * 150)}px`,
                  }}
                  />
                  <div className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" />
              </div>

              <div className="p-3 bg-[#2F2F2F]">
                  <h1 className="font-bold text-primary truncate">{artist.name}</h1>
                  <p className="text-xs text-light/80 mt-1">
                  {formatFollowers(artist?.followers)} followers
                  </p>
              </div>
            </div>
        ))}
        </Masonry>
      
      {loading && (
        <div className="flex justify-center py-6">
          <Loader className="animate-spin h-8 w-8 text-primary" />
        </div>
      )}

      {!loading && (
        <div className="flex justify-center py-6">
          <button onClick={handleLoadMore} className="px-6 py-2 bg-accent text-white font-bold rounded hover:bg-primary transition">
              Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default PopularArtists;