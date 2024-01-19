import { LoginForm } from '@/components/login-form'
import React from 'react'

const page = () => {
  return (
    <div className='h-[calc(100vh-3.5rem)] w-full flex justify-center items-center'>
      <LoginForm />
    </div>
  )
}

export default page