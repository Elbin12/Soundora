import React from 'react';

function SuggestedArtists({ artists }) {
  return (
    <div className='mt-16 absolute bg-secondary z-20 border-2 w-3/5 rounded-md overflow-hidden shadow-sm'>
      <div className='py-2 px-3 border-b '>
        <p className='text-sm font-medium text-light'>Suggested Artists</p>
      </div>
      <div className='max-h-64 overflow-y-auto'>
        { artists?.length > 0?
            artists?.map((artist, index) => (
                <div 
                    key={index}
                    className='flex items-center gap-3 px-3 py-2 hover:bg-light hover:text-secondary transition-colors duration-200 cursor-pointer border-b border-[#2F2F2F]/10 last:border-0'
                >
                    <div className='w-8 h-8 rounded-full overflow-hidden border-2 border-accent'>
                    <img 
                        src={artist?.profile_pic} 
                        alt={artist?.name} 
                        className='w-full h-full object-cover'
                    />
                    </div>
                    <h1 className='font-semibold'>{artist?.name}</h1>
                </div>
            ))
          :
          <div className='flex flex-col items-center justify-center py-8'>
            <p className='text-sm text-light/80'>No artist found.</p>
          </div>
        }
      </div>
    </div>
  );
}

export default SuggestedArtists;