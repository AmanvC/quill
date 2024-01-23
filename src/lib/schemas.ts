import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  }),
  password: z.string().min(1, {
    message: "Password cannot be empty!"
  })
});

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

const passwordField = () => {
  return z.string()
    .min(6,{ message: "Password should be atleast 6 characters long!" })
    .regex(passwordValidation, { message: "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character!" })
}

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  }),
  password: passwordField(),
  name: z.string().min(1, {
    message: "Name is required!"
  })
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required!"
  })
});

export const NewPasswordSchema = z.object({
  password: passwordField(),
  confirmPassword: z.string()
}).refine(
  ({password, confirmPassword}) => password === confirmPassword,
  {
    message: "Passwords do not match!",
    path: ["confirmPassword"]
  }
)
// }).superRefine(({ password, confirmPassword }, ctx) => {
//   if(confirmPassword !== password){
//     ctx.addIssue({
//       code: "custom",
//       message: "The passwords do not match!"
//     })
//   }
// });