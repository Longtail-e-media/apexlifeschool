/** Small hand-made touches: squiggle underline, tape strip, and a hand-drawn arrow. */

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" className={`pointer-events-none h-2 w-full text-sun ${className}`} aria-hidden="true">
      <path
        d="M2 8c20-8 30 4 50-1s32-6 50-1 30 5 48-1 32-3 48 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-sun/60 shadow-sm ${className}`}
    ></span>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 50" className={`h-10 w-16 text-maroon ${className}`} aria-hidden="true">
      <path d="M4 8c22 2 44 10 56 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 36l14 6 2-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
