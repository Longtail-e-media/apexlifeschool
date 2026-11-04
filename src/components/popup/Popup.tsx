"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import type { PopupSlide } from "@/lib/cms/popup";

// ─── Video embed helper ────────────────────────────────────────────────────────

interface ResolvedVideoEmbed {
  src: string;
  platform: string;
  portrait: boolean;
}

function isFacebookReel(pathname: string) {
  return /\/(reel|share\/r)\//.test(pathname);
}

function resolveVideoEmbed(rawSrc: string): ResolvedVideoEmbed {
  let url: URL;
  try {
    url = new URL(rawSrc);
  } catch {
    return { src: rawSrc, platform: "Video", portrait: false };
  }

  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtube.com" || host === "youtu.be") {
    const shortsMatch = url.pathname.match(/^\/shorts\/([^/?]+)/);
    if (shortsMatch) {
      return {
        src: `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&playsinline=1`,
        platform: "YouTube",
        portrait: true,
      };
    }
    if (url.pathname === "/watch" && url.searchParams.get("v")) {
      return {
        src: `https://www.youtube.com/embed/${url.searchParams.get("v")}?autoplay=1&mute=1&playsinline=1`,
        platform: "YouTube",
        portrait: false,
      };
    }
    if (url.searchParams.has("autoplay")) {
      return { src: rawSrc, platform: "YouTube", portrait: false };
    }
    const sep = rawSrc.includes("?") ? "&" : "?";
    return {
      src: `${rawSrc}${sep}autoplay=1&mute=1&playsinline=1`,
      platform: "YouTube",
      portrait: false,
    };
  }

  if (host === "instagram.com") {
    if (/\/embed\/?$/.test(url.pathname)) {
      return { src: rawSrc, platform: "Instagram", portrait: true };
    }
    const path = url.pathname.replace(/\/$/, "");
    return {
      src: `https://www.instagram.com${path}/embed`,
      platform: "Instagram",
      portrait: true,
    };
  }

  if (host === "facebook.com" || host === "fb.watch") {
    if (url.pathname === "/plugins/video.php") {
      const href = url.searchParams.get("href");
      return {
        src: rawSrc,
        platform: "Facebook",
        portrait: href ? isFacebookReel(href) : true,
      };
    }
    const plugin = new URL("https://www.facebook.com/plugins/video.php");
    plugin.searchParams.set("href", rawSrc);
    plugin.searchParams.set("show_text", "false");
    plugin.searchParams.set("autoplay", "true");
    plugin.searchParams.set("mute", "1");
    return {
      src: plugin.toString(),
      platform: "Facebook",
      portrait: isFacebookReel(url.pathname),
    };
  }

  if (host === "tiktok.com") {
    if (/^\/embed\/v2\//.test(url.pathname)) {
      return { src: rawSrc, platform: "TikTok", portrait: true };
    }
    const match = url.pathname.match(/\/video\/(\d+)/);
    if (match) {
      return {
        src: `https://www.tiktok.com/embed/v2/${match[1]}`,
        platform: "TikTok",
        portrait: true,
      };
    }
  }

  return { src: rawSrc, platform: "Video", portrait: false };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Popup({ popupData }: { popupData?: PopupSlide[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());
  const swiperRef = useRef<SwiperType | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const allSlides = useMemo(() => {
    if (!popupData || !Array.isArray(popupData)) return [];
    return popupData;
  }, [popupData]);

  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
      else if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
      else if (e.key === "ArrowRight") swiperRef.current?.slideNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closePopup]);

  if (allSlides.length === 0 || !isOpen) return null;

  const hasMultipleSlides = allSlides.length > 1;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-3 bg-black/75 backdrop-blur-[2px]"
      onClick={closePopup}
      role="presentation"
    >
      <div
        className="relative mx-auto w-full max-w-[440px] lg:max-w-[500px] max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="School announcement"
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          className="absolute right-3 top-3 z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          onClick={closePopup}
          aria-label="Close popup"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <Swiper
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          loop={hasMultipleSlides}
          autoHeight
          className="w-full"
        >
          {allSlides.map((content, index) => {
            const isImage = content.popupType === "image";
            const isExternal = Number(content.link_type) === 1 || (content.link ? /^https?:\/\//i.test(content.link) : false);
            const linkHref = content.link
              ? isExternal
                ? (/^https?:\/\//i.test(content.link) ? content.link : `https://${content.link}`)
                : (content.link.startsWith("/") ? content.link : `/${content.link}`)
              : null;
            const imgSrc =
              isImage && content.imglink && content.imglink.length > 0
                ? content.imglink[0].url
                : "";
            const videoEmbed = !isImage && content.src ? resolveVideoEmbed(content.src) : null;
            const isActiveSlide = index === activeIndex;
            const isVideoLoaded = loadedVideos.has(index);

            const renderImageWithOverlay = () => (
              <>
                <Image
                  src={imgSrc}
                  alt={content.title || "School announcement"}
                  width={800}
                  height={800}
                  priority={index === 0}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 440px, 500px"
                  className="w-full h-auto"
                />
                {content.title && (
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs sm:text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="truncate">{content.title}</span>
                    <span className="shrink-0 inline-flex items-center gap-1">
                      View{" "}
                      <i
                        className={`fa-solid ${
                          isExternal ? "fa-arrow-up-right-from-square" : "fa-chevron-right"
                        } text-[10px]`}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                )}
              </>
            );

            return (
              <SwiperSlide key={index} className="w-full bg-white">
                {isImage ? (
                  imgSrc ? (
                    linkHref ? (
                      isExternal ? (
                        <a
                          href={linkHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block w-full relative"
                        >
                          {renderImageWithOverlay()}
                        </a>
                      ) : (
                        <Link href={linkHref} className="group block w-full relative">
                          {renderImageWithOverlay()}
                        </Link>
                      )
                    ) : (
                      <Image
                        src={imgSrc}
                        alt={content.title || "School announcement"}
                        width={800}
                        height={800}
                        priority={index === 0}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 440px, 500px"
                        className="w-full h-auto"
                      />
                    )
                  ) : null
                ) : videoEmbed ? (
                  <div className="w-full bg-black flex flex-col items-center">
                    <div
                      className={`relative w-full bg-black ${
                        videoEmbed.portrait ? "max-w-[280px] mx-auto aspect-[9/16]" : "aspect-video"
                      }`}
                    >
                      {isActiveSlide && (
                        <>
                          {!isVideoLoaded && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                              <i className="fa-solid fa-spinner fa-spin text-2xl text-sun" aria-hidden="true" />
                            </div>
                          )}
                          <iframe
                            src={videoEmbed.src}
                            title={content.title || `${videoEmbed.platform} video`}
                            className="size-full relative z-0"
                            frameBorder="0"
                            allow="autoplay; fullscreen; encrypted-media"
                            allowFullScreen
                            onLoad={() =>
                              setLoadedVideos((prev) => {
                                const next = new Set(prev);
                                next.add(index);
                                return next;
                              })
                            }
                          />
                        </>
                      )}
                    </div>
                    <a
                      href={content.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-ink/60 hover:text-maroon transition-colors"
                    >
                      Watch on {videoEmbed.platform}
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" aria-hidden="true" />
                    </a>
                  </div>
                ) : null}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {hasMultipleSlides && (
          <>
            <button
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/70 text-ink shadow-md backdrop-blur-sm transition hover:bg-white"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
            >
              <i className="fa-solid fa-chevron-left text-sm" aria-hidden="true" />
            </button>
            <button
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/70 text-ink shadow-md backdrop-blur-sm transition hover:bg-white"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
            >
              <i className="fa-solid fa-chevron-right text-sm" aria-hidden="true" />
            </button>

            <div className="flex items-center justify-center gap-1.5 py-3 bg-white" role="tablist" aria-label="Slide selection">
              {allSlides.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Go to slide ${i + 1} of ${allSlides.length}`}
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  className={`h-1.5 rounded-full cursor-pointer transition-all ${
                    i === activeIndex ? "w-5 bg-maroon" : "w-1.5 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
