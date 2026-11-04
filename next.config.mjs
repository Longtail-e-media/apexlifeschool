/** @type {import('next').NextConfig} */

// The CMS serves its uploads (news, gallery, slideshow…) from the same host as the API, so allow that host for next/image.
const cmsUrl = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "");
  } catch {
    return null;
  }
})();
const cmsImagePattern = cmsUrl
  ? [{ protocol: cmsUrl.protocol.replace(":", ""), hostname: cmsUrl.hostname, port: cmsUrl.port, pathname: "/**" }]
  : [];

const nextConfig = {
  env: {
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_CONTACT_API_URL: process.env.NEXT_PUBLIC_CONTACT_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      // Old site URLs (.php) -> new routes, so existing search results keep working.
      { source: "/aboutus.php", destination: "/about-us", permanent: true },
      { source: "/history.php", destination: "/about-us", permanent: true },
      { source: "/facilities.php", destination: "/facilities", permanent: true },
      { source: "/activities.php", destination: "/activities", permanent: true },
      { source: "/events.php", destination: "/events", permanent: true },
      { source: "/news.php", destination: "/news", permanent: true },
      { source: "/notice.php", destination: "/notice", permanent: true },
      { source: "/gallery.php", destination: "/gallery", permanent: true },
      { source: "/gallery/:id", destination: "/gallery", permanent: true },
      { source: "/contactus.php", destination: "/contact-us", permanent: true },
      { source: "/message-from-chairperson.php", destination: "/message-from-chairperson", permanent: true },
      { source: "/message-from-principal.php", destination: "/message-from-principal", permanent: true },
    ];
  },
  images: {
    // Remote hosts the CMS may serve images from (local /apex/** files need no entry).
    // Next 16 refuses to optimise images served from a private/loopback IP (the local XAMPP backend). Dev only.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      ...cmsImagePattern,
      { protocol: "https", hostname: "s3.veda-app.com" },
      { protocol: "https", hostname: "veda-app.s3.ap-south-1.amazonaws.com" },
    ],
  },
};

export default nextConfig;
