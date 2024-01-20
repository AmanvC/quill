import EmailVerificationForm from '@/components/EmailVerificationForm'
import AuthCardWrapper from '@/components/auth-card-wrapper'
import React from 'react'

const EmailVerification = () => {
  return (
    <AuthCardWrapper>
      <EmailVerificationForm />
    </AuthCardWrapper>
  )
}

export default EmailVerification