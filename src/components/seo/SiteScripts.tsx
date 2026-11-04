import Script from "next/script";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { getAnalyticsIds } from "@/lib/metadata";

export default async function SiteScripts() {
  const { gaId, gtmId, clarityId, fbPixelId, schemaCode } = await getAnalyticsIds();

  return (
    <>
      {/* ── Google Tag Manager ───────────────────────────────────── */}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}

      {/* ── Google Analytics GA4 ─────────────────────────────────── */}
      {gaId && <GoogleAnalytics gaId={gaId} />}

      {/* ── Microsoft Clarity ────────────────────────────────────── */}
      {clarityId && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* ── Facebook Pixel ───────────────────────────────────────── */}
      {fbPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ── Custom JS Code from CMS (if any JS logic is present) ─── */}
      {schemaCode &&
        !schemaCode.trim().startsWith("<meta") &&
        !schemaCode.trim().startsWith("<link") &&
        !schemaCode.trim().includes("application/ld+json") && (
          <Script id="cms-schema" strategy="afterInteractive">
            {schemaCode.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "$1")}
          </Script>
        )}
    </>
  );
}
