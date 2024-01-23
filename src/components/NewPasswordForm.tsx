"use client";

import * as z from "zod";
import { NewPasswordSchema } from "@/lib/schemas";

import { CardWrapper } from "@/components/card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { useCallback, useEffect, useState, useTransition } from "react"; // for promise states
import { FormSuccess } from "@/components/form-success";
import { useSearchParams } from "next/navigation";
import { newPassword, tokenExists } from "@/actions/new-password";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

export const NewPasswordForm = () => {
  const params = useSearchParams();
  const token = params.get("token");
  
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const checkToken = useCallback(() => {
    startTransition(() => {
      tokenExists(token)
        .then((data) => {
          if(data.success){
            setShowForm(true);
            setShowErrorMessage(false);
          }else if(data.error){
            setErrorMessage(data.error);
            setShowForm(false);
            setShowErrorMessage(true);
          }
        })
    })
  }, [token]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);


  const handleSubmitForm = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
    })
  }

  if(!showForm && !showErrorMessage){
    return <BeatLoader />
  }

  if(showErrorMessage){
    return (
      <div>
        <p className="text-xl">{errorMessage}</p>
        <div className="flex justify-center">
          <Button variant="default" className="mt-2"><Link href="/login">Go to Login</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <CardWrapper 
      headerMessage="Reset Password"
      headerLabel="Reset your password here."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="******"
                      type={showPassword ? "text" : "password"}
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="******"
                      type={showPassword ? "text" : "password"}
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
  )
}