import { NextResponse } from "next/server";
import { admissionSchema } from "@/lib/admission";

/**
 * Admission inquiry relay.
 *
 * The school receives admission inquiries in its ingrails admission system. The browser can't post there
 * directly (cross-origin), so this route validates the form and forwards it server-side — adding the spam
 * protection the original form lacks (honeypot, rate limit, optional reCAPTCHA).
 *
 * Env (all optional):
 *   ADMISSION_SUBMIT_URL     override the target (default: ingrails submitForm)
 *   ADMISSION_SCHOOL_TOKEN   override the school token (default: Apex Life School's public form token)
 *   RECAPTCHA_SECRET_KEY     when set, a valid reCAPTCHA token is required
 */
const SUBMIT_URL = process.env.ADMISSION_SUBMIT_URL ?? "https://www.ingrails.com/school/admission/submitForm";
const SCHOOL_TOKEN = process.env.ADMISSION_SCHOOL_TOKEN ?? "emIzQmE0K3c0SkZhRFpPWWNTTVpTUT09";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

// Best-effort per-IP limit (per server instance): 5 submissions / 10 minutes.
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW)) hits.delete(k);
  return recent.length > MAX;
}

const fail = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) return fail("Too many submissions. Please try again in a few minutes.", 429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots don't retry.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = admissionSchema.safeParse(body);
  if (!parsed.success) return fail("Please check the form and try again.", 422);

  if (RECAPTCHA_SECRET) {
    const token = typeof body.captcha === "string" ? body.captcha : "";
    const check = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token }),
    })
      .then((r) => r.json() as Promise<{ success?: boolean }>)
      .catch(() => ({ success: false }));
    if (!check.success) return fail("Please complete the reCAPTCHA and try again.", 400);
  }

  // Same fields (and hidden fields) as the original ingrails form.
  const form = new FormData();
  form.set("school", SCHOOL_TOKEN);
  form.set("format", "");
  form.set("form_type", "1");
  form.set("json", "1");
  for (const [key, value] of Object.entries(parsed.data)) form.set(key, value);

  try {
    const res = await fetch(SUBMIT_URL, { method: "POST", body: form, signal: AbortSignal.timeout(15000) });
    const text = await res.text();
    let data: { status?: boolean; message?: string; redirect?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      /* non-JSON reply */
    }

    if (res.ok && data.status === true) {
      return NextResponse.json({ ok: true, redirect: typeof data.redirect === "string" ? data.redirect : undefined });
    }
    console.error("[admission] upstream rejected submission", res.status, text.slice(0, 300));
    return fail(data.message || "We couldn’t submit your form just now. Please try again or call the school office.", 502);
  } catch (error) {
    console.error("[admission] upstream error", error);
    return fail("We couldn’t reach the admission system. Please try again or call the school office.", 502);
  }
}
