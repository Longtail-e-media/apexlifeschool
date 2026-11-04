"use client";

import { useState } from "react";
import Image from "next/image";
import { Tape } from "./Doodles";

export interface TestimonialVideoItem {
  id?: string;
  name: string;
  role: string;
  poster: string;
  /** YouTube watch / shorts / share link, or direct video file URL */
  url: string;
  content?: string;
}

const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]"];

/** Pulls the video id and optional start time (seconds) out of a YouTube link. */
function parseYouTube(url: string): { id: string; start: number } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.replace(/^\/+/, "").split("/")[0] || null;
    } else if (u.searchParams.has("v")) {
      id = u.searchParams.get("v");
    } else if (u.pathname.includes("/shorts/")) {
      id = u.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0] || null;
    } else if (u.pathname.includes("/embed/")) {
      id = u.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0] || null;
    } else {
      const parts = u.pathname.split("/").filter(Boolean);
      const last = parts.pop();
      if (last && !last.startsWith("@") && last !== "watch") id = last;
    }
    if (!id || id.startsWith("@") || id === "watch") return null;
    const t = u.searchParams.get("t") ?? u.searchParams.get("start");
    return { id, start: t ? parseInt(t, 10) || 0 : 0 };
  } catch {
    return null;
  }
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

/**
 * Taped polaroid portraits that play their YouTube / direct video in place: a play button sits on the photo, and clicking it
 * swaps the photo for the player. One video plays at a time.
 */
export default function TestimonialVideos({
  items,
  className = "",
}: {
  items: TestimonialVideoItem[];
  className?: string;
}) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <ul aria-label="Video testimonials" className={`grid gap-8 sm:grid-cols-3 ${className}`}>
      {items.map((p, i) => {
        const yt = parseYouTube(p.url);
        const direct = isDirectVideo(p.url);
        const hasVideo = Boolean(yt || direct);
        const isPlaying = playing === (p.id || p.name) && hasVideo;

        return (
          <li
            key={p.id || p.name}
            className={`relative rounded-sm bg-white p-3 pb-4 shadow-md ring-1 ring-ink/10 transition hover:rotate-0 hover:shadow-xl ${
              tilts[i % tilts.length]
            }`}
          >
            <Tape />

            <div className="relative aspect-4/3 overflow-hidden bg-ink">
              {isPlaying ? (
                <>
                  {yt ? (
                    <iframe
                      title={`Video testimonial: ${p.name}, ${p.role}`}
                      src={`https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1${
                        yt.start ? `&start=${yt.start}` : ""
                      }`}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <video
                      src={p.url}
                      controls
                      autoPlay
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setPlaying(null)}
                    aria-label={`Close the video from ${p.name}`}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-sm text-ink shadow hover:bg-paper cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                  </button>
                </>
              ) : (
                <>
                  {p.poster ? (
                    <Image
                      src={p.poster}
                      alt={p.name}
                      fill
                      sizes="(min-width: 640px) 368px, 100vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-maroon-deep text-paper/30">
                      <i className="fa-solid fa-user text-5xl" aria-hidden="true" />
                    </div>
                  )}
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setPlaying(p.id || p.name)}
                      aria-label={`Play video: ${p.name}, ${p.role}`}
                      className="group absolute inset-0 transition hover:bg-ink/10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-sun cursor-pointer"
                    >
                      <span className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-base text-maroon shadow-lg transition group-hover:scale-110 group-hover:bg-sun group-hover:text-ink">
                        <i className="fa-solid fa-play ml-0.5" aria-hidden="true"></i>
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="mt-3 font-hand text-2xl leading-none">{p.name}</p>
            <p className="text-sm font-semibold text-leaf-deep">{p.role}</p>
          </li>
        );
      })}
    </ul>
  );
}
