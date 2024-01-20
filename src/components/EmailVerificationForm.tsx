"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { CardWrapper } from '@/components/card-wrapper';
import { BeatLoader } from "react-spinners";
import { useSearchParams } from 'next/navigation';
import { emailVerification } from "@/actions/email-verification";
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

const EmailVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const params = useSearchParams();
  const token = params.get("token");

  const onSubmit = useCallback(() => {
    if(!token) {
      setError("Invalid link.");
      return;
    };
    emailVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      })
  }, [token])

  useEffect(() => {
    onSubmit();
  }, [onSubmit])

  return (
    <CardWrapper
      headerMessage='Email Verification'
      headerLabel={!success && !error ? "Please wait till we verify your email..." : error ? "Uh Oh!" : ""}
      backButtonLabel={success || error ? "Continue to login" : ""}
      backButtonHref='/login'
    >
      <div className="flex flex-col gap-5 items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}

export default EmailVerificationForm