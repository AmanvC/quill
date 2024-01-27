"use client";

import * as z from "zod";

import React, { useState, useTransition } from 'react'
import Loader from '@/components/loader';
import { CardWrapper } from '@/components/card-wrapper';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ChangePasswordSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { updatePassword } from "@/actions/update-password";
import { TFailure } from "@/lib/types";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    mode: 'onChange'
  })

  const handleSubmitForm = (values: z.infer<typeof ChangePasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      updatePassword(values, user?.email as string)
        .then((data) => {
          data.success ? setSuccess(data.message) : setError(data.message);
        })
        .catch((err: TFailure) => {
          toast.error(err.message);
        })
    })
  }

  return (
    <>
      {isPending && <Loader />}
      <CardWrapper 
          headerMessage="Reset Password"
          headerLabel=""
          backButtonLabel="Back to dashboard"
          backButtonHref="/dashboard"
        >
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Current password"
                          type= {showPassword ? "text" : "password"} 
                          {...field} 
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="******"
                          type= {showPassword ? "text" : "password"} 
                          {...field} 
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="******"
                          type= {showPassword ? "text" : "password"} 
                          {...field} 
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                      <p 
                        className="mt-10 text-sm hover:underline cursor-pointer inline-block"
                        onClick={() => setShowPassword(prev => !prev)}
                      >
                        {showPassword ? "Hide Password" : "Show Password"}
                      </p>
                    </FormItem>
                  )}
                />
                
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                disabled={isPending}
                type="submit"
                className="w-full"
              >
                Reset Password
              </Button>
            </form>
          </Form>
        </CardWrapper>
    </>
  )
}

export default ChangePasswordForm