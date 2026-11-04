"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const Recaptcha = dynamic(() => import("./Recaptcha"), { ssr: false });

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .regex(/^[0-9+\-\s]+$/, "Use only digits, spaces, + or -"),
  subject: z.string().min(1, "Please add a subject"),
  message: z.string().min(10, "Please write at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const field =
  "w-full rounded-md border border-ink/20 bg-white px-4 py-3 outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/20 aria-invalid:border-red-600";
const label = "mb-1.5 block text-sm font-bold";

function Field({ id, name, error, children }: { id: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={label}>{name}</label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export default function ContactForm() {
  const [token, setToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const endpoint = process.env.NEXT_PUBLIC_CONTACT_API_URL;

  const onSubmit = async (data: FormData) => {
    if (!endpoint) {
      setError("The message form isn’t available right now. Please call or email us instead.");
      return;
    }
    if (!token) {
      setError("Please tick the reCAPTCHA box first.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, "g-recaptcha-response": token }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setSent(true);
      reset();
      setToken(null);
    } catch {
      setError("Something went wrong. Please try again, or call the school office.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div role="status" className="rounded-xl border border-leaf/30 bg-mint p-8 text-center">
        <i className="fa-solid fa-circle-check text-4xl text-leaf-deep" aria-hidden="true"></i>
        <h3 className="mt-4 font-display text-2xl font-semibold">Thank you — message sent!</h3>
        <p className="mx-auto mt-2 max-w-sm text-ink/70">We’ve received your message and will reply as soon as we can.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 rounded-md border-2 border-maroon px-5 py-2 text-sm font-bold text-maroon hover:bg-maroon hover:text-paper">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field id="cf-name" name="Full name" error={errors.name?.message}>
        <input id="cf-name" type="text" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-error" : undefined} className={field} {...register("name")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cf-phone" name="Phone number" error={errors.phone?.message}>
          <input id="cf-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "cf-phone-error" : undefined} className={field} {...register("phone")} />
        </Field>
        <Field id="cf-email" name="Email address" error={errors.email?.message}>
          <input id="cf-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-error" : undefined} className={field} {...register("email")} />
        </Field>
      </div>
      <Field id="cf-subject" name="Subject" error={errors.subject?.message}>
        <input id="cf-subject" type="text" aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "cf-subject-error" : undefined} className={field} {...register("subject")} />
      </Field>
      <Field id="cf-message" name="Your message" error={errors.message?.message}>
        <textarea id="cf-message" rows={5} aria-invalid={!!errors.message} aria-describedby={errors.message ? "cf-message-error" : undefined} className={field} {...register("message")} />
      </Field>

      <Recaptcha onChange={setToken} />
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-md bg-maroon px-7 py-3 font-bold text-paper transition hover:bg-maroon-deep disabled:opacity-60">
        {sending ? "Sending…" : "Send message"} <i className="fa-solid fa-paper-plane text-sm" aria-hidden="true"></i>
      </button>
    </form>
  );
}
