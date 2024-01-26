import React from 'react'
import { FadeLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className='w-full h-full absolute top-0 left-0 opacity-80 flex items-center justify-center bg-white z-1000000'>
      <FadeLoader />
    </div>
  )
}

export default Loader