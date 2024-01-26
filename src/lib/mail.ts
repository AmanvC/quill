import EmailTemplate from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async(name: string, email: string, token: string) => {
  try {
    const confirmLink = `${domain}/mail/email-verification?token=${token}`;
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
    const resetLink = `${domain}/mail/reset-password?token=${token}`;
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