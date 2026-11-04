"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AGES, GRADES, admissionSchema, type AdmissionData } from "@/lib/admission";

const Recaptcha = dynamic(() => import("./Recaptcha"), { ssr: false });

const field =
  "w-full rounded-md border border-ink/20 bg-white px-4 py-3 outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/20 aria-invalid:border-red-600";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label} <span className="text-maroon" aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}

type Reply = { ok: boolean; message?: string; redirect?: string };

/** Admission inquiry form. `captcha` is true only when the server is set up to verify reCAPTCHA. */
export default function AdmissionForm({ captcha }: { captcha: boolean }) {
  const [token, setToken] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ redirect?: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdmissionData>({ resolver: zodResolver(admissionSchema) });

  const aria = (name: keyof AdmissionData, id: string) => ({
    id,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${id}-error` : undefined,
    className: field,
  });

  const onSubmit = async (data: AdmissionData) => {
    if (!confirmed) {
      setError("Please confirm the details are correct before submitting.");
      return;
    }
    if (captcha && !token) {
      setError("Please tick the reCAPTCHA box first.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const form = document.getElementById("admission-form") as HTMLFormElement | null;
      const website = (form?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website, captcha: token }),
      });
      const reply: Reply = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !reply.ok) {
        setError(reply.message ?? "Something went wrong. Please try again.");
        return;
      }
      setDone({ redirect: reply.redirect });
      reset();
      setToken(null);
      setConfirmed(false);
    } catch {
      setError("We couldn’t send your form. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="rounded-xl border border-leaf/30 bg-mint p-8 text-center">
        <i className="fa-solid fa-circle-check text-4xl text-leaf-deep" aria-hidden="true"></i>
        <h2 className="mt-4 font-display text-2xl font-semibold">Thank you — your inquiry is submitted!</h2>
        <p className="mx-auto mt-2 max-w-md text-ink/70">Our team will get in touch with you shortly.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {done.redirect && (
            <a href={done.redirect} target="_blank" rel="noopener noreferrer" className="rounded-md bg-maroon px-5 py-2.5 text-sm font-bold text-paper hover:bg-maroon-deep">
              View confirmation
            </a>
          )}
          <button type="button" onClick={() => setDone(null)} className="rounded-md border-2 border-maroon px-5 py-2 text-sm font-bold text-maroon hover:bg-maroon hover:text-paper">
            Submit another inquiry
          </button>
          <Link href="/" className="rounded-md border-2 border-ink/20 px-5 py-2 text-sm font-bold hover:border-ink">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <form id="admission-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-2499.75 h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-5 flex items-center gap-3 font-display text-xl font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun text-sm font-bold" aria-hidden="true">1</span>
          Child’s information
        </legend>

        <Field id="af-name" label="Name of the child (full name)" error={errors.full_name?.message}>
          <input type="text" autoComplete="off" {...aria("full_name", "af-name")} {...register("full_name")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="af-class" label="Interested grade" error={errors.class?.message}>
            <select defaultValue="" {...aria("class", "af-class")} {...register("class")}>
              <option value="" disabled>— Select —</option>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field id="af-age" label="Age" error={errors.age?.message}>
            <select defaultValue="" {...aria("age", "af-age")} {...register("age")}>
              <option value="" disabled>— Select —</option>
              {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
        </div>

        <Field id="af-address" label="Location" error={errors.address?.message}>
          <input type="text" autoComplete="street-address" placeholder="e.g. Chabahil, Kathmandu" {...aria("address", "af-address")} {...register("address")} />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-5 flex items-center gap-3 font-display text-xl font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sun text-sm font-bold" aria-hidden="true">2</span>
          Parent’s information
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="af-parent" label="Parent’s name" error={errors.father_name?.message}>
            <input type="text" autoComplete="name" {...aria("father_name", "af-parent")} {...register("father_name")} />
          </Field>
          <Field id="af-mobile" label="Mobile no." error={errors.f_cell?.message}>
            <input type="tel" inputMode="tel" autoComplete="tel" {...aria("f_cell", "af-mobile")} {...register("f_cell")} />
          </Field>
        </div>
      </fieldset>

      {captcha && <Recaptcha onChange={setToken} />}

      <div className="space-y-4">
        <label className="flex items-start gap-3 text-sm leading-6 text-ink/80">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 h-4 w-4 accent-maroon" />
          I confirm the details above are correct. After submission they can’t be edited online.
        </label>

        {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}

        <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-md bg-maroon px-8 py-3.5 font-bold text-paper transition hover:bg-maroon-deep disabled:opacity-60">
          {sending ? "Submitting…" : "Apply now"} <i className="fa-solid fa-paper-plane text-sm" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
}
