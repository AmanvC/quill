"use client";

import * as z from "zod";
import { ResetPasswordSchema } from "@/lib/schemas";

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
import { useState, useTransition } from "react"; // for promise states
import { FormSuccess } from "@/components/form-success";
import { resetPassword } from "@/actions/reset-password";

export const ResetPasswordForm = () => {
  
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const handleSubmitForm = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      resetPassword(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        })
    })
  }

  return (
    <CardWrapper 
      headerMessage="Forgot Password?"
      headerLabel="Don't worry, reset it from here."
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
            
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
          disabled={isPending}
            type="submit"
            className="w-full"
          >
            Send email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}