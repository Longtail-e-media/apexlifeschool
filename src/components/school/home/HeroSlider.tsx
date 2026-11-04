"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import type { HeroSlide } from "@/types";
import { Tape } from "../Doodles";

const DELAY = 6000;

const isVideo = (s: HeroSlide) => s.mediaType === "video" || (!!s.video && !s.src);
const isExternal = (href: string) => /^https?:\/\//.test(href);

const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-xs hover:border-maroon hover:text-maroon";

const reducedQuery = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(reducedQuery);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

/**
 * Hero media, one mode at a time (same item shape as the `slideshow` API):
 *  - any video item  -> that video alone, with pause + mute (no slider)
 *  - several images  -> image slider
 *  - one image       -> plain photo, no slider
 */
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const video = slides.find(isVideo);
  if (video) return <VideoHero slide={video} />;

  const images = slides.filter((s) => s.src);
  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <Frame>
        <Photo slide={images[0]} first />
        <Caption slide={images[0]} />
      </Frame>
    );
  }
  return <ImageSlider slides={images} />;
}

/* ───────────────────────── shared pieces ───────────────────────── */

function Frame({ children, label = "Apex Life School highlights" }: { children: ReactNode; label?: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      className="relative mx-auto w-full min-w-0 max-w-xl rounded-sm bg-white p-2.5 shadow-xl ring-1 ring-ink/10 sm:rotate-[1.5deg] sm:p-3"
    >
      <Tape />
      {children}
    </div>
  );
}

function Photo({ slide, first = false }: { slide: HeroSlide; first?: boolean }) {
  if (!slide.src) return null;
  return (
    <div className="relative aspect-4/3 overflow-hidden bg-ink">
      <Image
        src={slide.src}
        alt={slide.title || "Apex Life School"}
        fill
        preload={first}
        // Remote CMS hosts aren't whitelisted in next.config, so serve them as-is.
        unoptimized={!slide.src.startsWith("/")}
        sizes="(min-width: 1024px) 560px, 100vw"
        className="object-cover object-[50%_55%]"
      />
    </div>
  );
}

function CaptionText({ slide }: { slide: HeroSlide }) {
  const href = slide.buttonLink && slide.buttonLink !== "#" ? slide.buttonLink : null;
  const linkCls = "mt-2 inline-block text-sm font-bold text-maroon hover:underline";
  const linkBody = (
    <>
      Learn more <i className="fa-solid fa-arrow-right ml-1 text-xs" aria-hidden="true"></i>
    </>
  );

  return (
    <>
      {slide.tag && <p className="text-xs font-bold uppercase tracking-widest text-leaf-deep">{slide.tag}</p>}
      {slide.title && <p className="font-hand text-3xl leading-none text-maroon">{slide.title}</p>}
      {slide.description && <p className="mt-1 line-clamp-2 text-sm text-ink/70">{slide.description}</p>}
      {href &&
        (isExternal(href) ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{linkBody}</a>
        ) : (
          <Link href={href} className={linkCls}>{linkBody}</Link>
        ))}
    </>
  );
}

/**
 * Caption under the photo. Every slide's caption is stacked in the same grid cell and only the active
 * one is visible, so the area is always as tall as the tallest caption and the card (and the page
 * below it) never changes height when the slide changes.
 */
function Caption({
  slide,
  slides,
  active = 0,
  controls,
}: {
  slide: HeroSlide;
  slides?: HeroSlide[];
  active?: number;
  controls?: ReactNode;
}) {
  const list = slides ?? [slide];

  return (
    <div className="flex flex-col gap-3 px-1 pb-1 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="grid min-w-0 flex-1">
        {list.map((s, i) => (
          <div
            key={s.id ?? i}
            aria-hidden={i !== active}
            className={`col-start-1 row-start-1 min-w-0 ${i === active ? "" : "invisible"}`}
          >
            <CaptionText slide={s} />
          </div>
        ))}
      </div>
      {controls}
    </div>
  );
}

/* ───────────────────────── video: pause + mute ───────────────────────── */

function VideoHero({ slide }: { slide: HeroSlide }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true); // browsers only autoplay muted videos

  const running = !paused && !reduced;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (running) v.play().catch(() => {});
    else v.pause();
  }, [running]);

  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  return (
    <Frame label="Apex Life School video">
      <div className="relative aspect-4/3 overflow-hidden bg-ink">
        <video
          ref={ref}
          src={slide.video || slide.src}
          // API pattern: when an item has both `video` and `src`, `src` is the still image.
          poster={slide.video && slide.src ? slide.src : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={slide.title || "Apex Life School video"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <Caption
        slide={slide}
        controls={
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setPaused(running)}
              aria-label={running ? "Pause video" : "Play video"}
              className={iconBtn}
            >
              <i className={`fa-solid ${running ? "fa-pause" : "fa-play"}`} aria-hidden="true"></i>
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className={iconBtn}
            >
              <i className={`fa-solid ${muted ? "fa-volume-xmark" : "fa-volume-high"}`} aria-hidden="true"></i>
            </button>
          </div>
        }
      />
    </Frame>
  );
}

/* ───────────────────────── images: slider ───────────────────────── */

function ImageSlider({ slides }: { slides: HeroSlide[] }) {
  const reduced = usePrefersReducedMotion();
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const running = !paused && !reduced;

  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;
    if (running) autoplay.start();
    else autoplay.stop();
  }, [running]);

  return (
    <Frame>
      <div className="relative aspect-4/3 overflow-hidden bg-ink">
        <Swiper
          modules={[Autoplay, A11y, Keyboard]}
          slidesPerView={1}
          rewind
          keyboard
          autoplay={{ delay: DELAY, disableOnInteraction: false }}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActive(s.realIndex)}
          className="h-full w-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={slide.id ?? i}>
              {slide.src && (
                <Image
                  src={slide.src}
                  alt={slide.title || "Apex Life School"}
                  fill
                  preload={i === 0}
                  unoptimized={!slide.src.startsWith("/")}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover object-[50%_55%]"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Caption
        slide={slides[active] ?? slides[0]}
        slides={slides}
        active={active}
        controls={
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous slide" className={iconBtn}>
                <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                onClick={() => setPaused(running)}
                aria-label={running ? "Pause slideshow" : "Play slideshow"}
                className={iconBtn}
              >
                <i className={`fa-solid ${running ? "fa-pause" : "fa-play"}`} aria-hidden="true"></i>
              </button>
              <button type="button" onClick={() => swiperRef.current?.slideNext()} aria-label="Next slide" className={iconBtn}>
                <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:justify-end">
              {slides.map((s, i) => (
                <button
                  key={s.id ?? i}
                  type="button"
                  onClick={() => swiperRef.current?.slideTo(i)}
                  aria-label={`Show slide ${i + 1}${s.title ? `: ${s.title}` : ""}`}
                  aria-current={i === active}
                  className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-maroon" : "w-2 bg-ink/25 hover:bg-ink/50"}`}
                />
              ))}
            </div>
          </div>
        }
      />
    </Frame>
  );
}
