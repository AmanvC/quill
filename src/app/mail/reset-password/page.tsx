import { NewPasswordForm } from '@/components/NewPasswordForm'
import AuthCardWrapper from '@/components/auth-card-wrapper'
import React from 'react'

const ResetPassword = () => {
  return (
    <AuthCardWrapper>
      <NewPasswordForm />
    </AuthCardWrapper>
  )
}

export default ResetPassword