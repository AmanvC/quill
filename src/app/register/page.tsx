import AuthCardWrapper from '@/components/auth-card-wrapper'
import { RegisterForm } from '@/components/register-form'
import React from 'react'

const page = () => {
  return (
    <AuthCardWrapper>
      <RegisterForm />
    </AuthCardWrapper>
  )
}

export default page