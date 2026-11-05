"use client";

import { useEffect, useRef, useState } from "react";

const HEADLINE = "welcome to apex life school Where every child is known by name.";

const FALLBACK_VIDEO = "/apex/video/xTqwM8R.mp4";

export default function Video({ src }: { src?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
    } else {
      el.pause();
    }
  };

  // Scroll-driven reveal: the section is tall, the stage inside is sticky.
  // As the user scrolls, a gradient layer slides up over the video and the
  // text rises with it (parallax). Styles are written straight to the DOM
  // so scrolling never triggers a React re-render.
  useEffect(() => {
    const section = sectionRef.current;
    const cover = coverRef.current;
    const text = textRef.current;
    const media = videoRef.current;
    const para = paraRef.current;
    const head = headRef.current;
    if (!section || !cover || !text || !para || !media || !head) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const p = reduce ? 0 : Math.min(1, Math.max(0, -rect.top / span));
      const c = Math.min(1, p / 0.75); // cover finishes before the stage unsticks

      cover.style.opacity = String(Math.min(1, c * 1.4));
      cover.style.transform = `translate3d(0, ${(1 - c) * 60}%, 0)`;
      text.style.transform = `translate3d(0, ${-p * 5}vh, 0)`;
      head.style.transform = `scale(${1 + p * 0.3})`; // headline zooms in as you scroll
      const q = Math.min(1, Math.max(0, (p - 0.15) / 0.35)); // paragraph fades in on scroll
      para.style.opacity = String(q);
      para.style.transform = `translate3d(0, ${(1 - q) * 32}px, 0)`;
      media.style.transform = `scale(${1 + p * 0.12})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[220vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src || FALLBACK_VIDEO}
        className="h-full w-full object-cover will-change-transform"
        autoPlay
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/35" />

      <div
        ref={coverRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ opacity: 0, background: "linear-gradient(292deg,rgba(13, 115, 60, 1) 0%, rgba(11, 184, 86, 1) 100%)" }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pt-28 sm:pt-32">
        <div
          ref={textRef}
          className="flex max-w-4xl flex-col items-center text-center will-change-transform"
        >
          <h2
            ref={headRef}
            aria-label={HEADLINE}
            className="flex flex-col items-center font-hand font-bold leading-none text-white drop-shadow-lg will-change-transform"
          >
            <span aria-hidden className="text-6xl sm:text-5xl lg:text-2xl">
            Welcome to Apex Life School
            </span>
            <span aria-hidden className="text-4xl sm:text-5xl lg:text-6xl">
              Where every child is
            </span>
            <span aria-hidden className="relative my-3 inline-block px-6 sm:my-4 sm:px-10">
              <span className="absolute inset-x-0 bottom-[6%] top-[22%] -rotate-2 rounded-md bg-[#29be0b]" />
              <span className="relative text-7xl leading-[1.05] text-white sm:text-8xl lg:text-9xl">
                known
              </span>
            </span>
            <span aria-hidden className="relative inline-block text-5xl sm:text-6xl lg:text-7xl">
              by name
              <svg
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full sm:h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              >
                <path d="M3 9 C 70 2, 140 13, 297 5" />
              </svg>
            </span>
          </h2>
          <p
            ref={paraRef}
            className="mt-25 max-w-2xl text-base leading-relaxed text-white/90 will-change-transform sm:text-lg lg:text-xl"
            style={{ opacity: 0 }}
          >
            Apex Life School is a warm, well-equipped school in Chabahil,
            Kathmandu. With one teacher for every nine students, your child
            gets the attention to settle in, speak up and thrive.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-black shadow-lg backdrop-blur transition hover:bg-white"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
          </svg>
        )}
      </button>
      </div>
    </section>
  );
}
