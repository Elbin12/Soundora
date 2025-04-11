import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='py-4 flex items-center justify-between w-full bg-light px-3 sm:px-11 md:px-20 shadow-md fixed z-20'>
      <Link to={'/'} className='text-3xl font-extrabold text-emerald-50'>Soundora</Link>
    </div>
  )
}

export default Navbar
