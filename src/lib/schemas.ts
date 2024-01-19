import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  }),
  password: z.string().min(1, {
    message: "Password cannot be empty!"
  })
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  }),
  password: z.string().min(6, {
    message: "Password should be atleast 6 characters long!"
  }),
  name: z.string().min(1, {
    message: "Name is required!"
  })
});