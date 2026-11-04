"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { ReCAPTCHAProps } from "react-google-recaptcha";

interface RecaptchaProps {
  onChange: (token: string | null) => void;
  theme?: "light" | "dark";
  dark?: boolean;
}

export default function Recaptcha({ onChange, theme = "light", dark }: RecaptchaProps) {
  const [ReCAPTCHAComponent, setReCAPTCHAComponent] = useState<ComponentType<ReCAPTCHAProps> | null>(null);

  useEffect(() => {
    // Only import react-google-recaptcha dynamically once mounted in the browser
    import("react-google-recaptcha").then((mod) => {
      setReCAPTCHAComponent(() => mod.default);
    }).catch((err) => {
      console.error("Failed to load reCAPTCHA component dynamically:", err);
    });
  }, []);

  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  
  // If 'dark' prop is provided, it takes precedence over 'theme'
  const activeTheme = dark !== undefined ? (dark ? "dark" : "light") : theme;

  if (!siteKey) {
    return <p className="my-4 text-sm text-ink/60">Spam protection isn’t configured yet.</p>;
  }

  if (!ReCAPTCHAComponent) {
    // Render a high-quality loading skeleton that matches the physical dimensions of standard reCAPTCHA (302px x 78px)
    return (
      <div className="my-4 flex justify-start max-[400px]:origin-top-left max-[400px]:scale-[0.8] max-[400px]:-mb-3">
        <div className="h-[78px] w-[302px] bg-slate-100 animate-pulse rounded-lg border border-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="my-4 flex justify-start max-[400px]:origin-top-left max-[400px]:scale-[0.8] max-[400px]:-mb-3">
      <ReCAPTCHAComponent
        sitekey={siteKey}
        onChange={onChange}
        theme={activeTheme}
      />
    </div>
  );
}