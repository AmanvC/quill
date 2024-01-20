import React from 'react'

const AuthCardWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-[calc(100vh-3.5rem)] w-full flex justify-center items-center'>
      {children}
    </div>
  )
}

export default AuthCardWrapper