import { RegisterForm } from '@/components/register-form'
import React from 'react'

const page = () => {
  return (
    <div className='h-[calc(100vh-3.5rem)] w-full flex justify-center items-center'>
      <RegisterForm />
    </div>
  )
}

export default page