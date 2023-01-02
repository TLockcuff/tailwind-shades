import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Init PostHog
    posthog.init("phc_pyjXNruLI6k9F51Sn0SQflgPUbvGa11qmUHgLLTokmH", {
      api_host: "https://app.posthog.com",
    });

    // Track page views
    const handleRouteChange = () => posthog.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Tailwind Shades Generator</title>
        <meta name="title" content="Tailwind Shades Generator" />
        <meta name="description" content="Quickly generate Tailwind shades and CSS variables for your project." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tailwindshades.app/" />
        <meta property="og:title" content="Tailwind Shades Generator" />
        <meta property="og:description" content="Quickly generate Tailwind shades and CSS variables for your project." />
        <meta property="og:image" content="https://tailwindshades.app/cover.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tailwindshades.app/" />
        <meta property="twitter:title" content="Tailwind Shades Generator" />
        <meta property="twitter:description" content="Quickly generate Tailwind shades and CSS variables for your project." />
        <meta property="twitter:image" content="https://tailwindshades.app/cover.jpg" />
        <link rel="manifest" href="/site.webmanifest"></link>
        <script defer data-domain="tailwindshades.app" src="https://insights.tlockcuff.dev/js/script.outbound-links.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
