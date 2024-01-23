import EmailTemplate from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async(name: string, email: string, token: string) => {
  try {
    const confirmLink = `http://localhost:3000/mail/email-verification?token=${token}`;
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email.",
      react: EmailTemplate({name, confirmLink})
    })
  } catch {
    return;
  }
}

export const sendPasswordResetEmail = async(name: string, email: string, token: string) => {
  try {
    const resetLink = `http://localhost:3000/mail/reset-password?token=${token}`;
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password.",
      react: `<p>Hello ${name}. Click <a href="${resetLink}">here</a> to reset your password.</p>`
    })
  } catch {
    return;
  }
}

// TODO - Create templates for both, verification and reset, and update links and (from) field