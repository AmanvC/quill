"use client";

import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { LoginSchema } from "@/lib/schemas";

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
import { login } from "@/actions/login";
import { useState, useTransition } from "react"; // for promise states
import { FormSuccess } from "@/components/form-success";
import Link from "next/link";
import { TActionResponse } from "@/lib/types";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { resendVerificationEmail } from "@/actions/resend-verification-email";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";
  const callbackUrl = searchParams.get("callbackUrl");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmitForm = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values, callbackUrl as string)
        .then((data: TActionResponse) => {
          if(!data?.success){
            setError(data?.message);
            if(data?.errorType === 'NOT_VERIFIED'){
              toast(data?.message, {
                action: {
                  label: 'Resend email',
                  onClick: () => handleResendEmail(values.email)
                }
              })
            }
          }
        })
    })
  }

  const handleResendEmail = (email: string) => {
    startTransition(() => {
      resendVerificationEmail(email)
        .then((data: TActionResponse) => {
          if(data.success){
            toast(data.message);
          }else{
            toast(data.message);
          }
        })
    })
  }

  return (
    <>
      {isPending && <Loader />}
      <CardWrapper 
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/register"
        showSocial
      >
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="john.doe@example.com"
                        type="email" 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="******"
                        type="password" 
                        {...field} 
                        disabled={isPending}
                      />
                    </FormControl>
                    <Button 
                      size="sm" 
                      variant="link" 
                      asChild
                      className="px-0 font-normal w-full justify-end text-gray-500"
                    >
                      <Link href="/reset/password">Forgot password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  )
}