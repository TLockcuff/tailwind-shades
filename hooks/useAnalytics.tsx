import { createContext, useContext, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";

interface AnalyticsContextProps {
  event: (event_name: string, props: any) => void;
}

export const AnalyticsContext = createContext<AnalyticsContextProps>({} as AnalyticsContextProps);

export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    mixpanel.init("6f0bebe12be29185ace37b87f0267912", { debug: false });
  }, []);

  const event = debounce((event_name: string, props: any) => {
    try {
      //   console.log("Track event", event_name, props);
      mixpanel.track(event_name, props);
    } catch (e) {
      console.log(e);
    }
  }, 100);

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      //Send track event when new pages is loaded
      event("Page view", { url });
    };

    if (router.pathname === "/") {
      event("Page view", { url: router.pathname });
    }

    // track all outgoing links
    document.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        const href = target.getAttribute("href");
        if (href && href.startsWith("http")) {
          event("Outbound link", { href });
        }
      }

      return true;
    });

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [event, router.events, router.pathname]);

  const providerValue = {
    event,
  } as AnalyticsContextProps;

  return <AnalyticsContext.Provider value={providerValue}>{children}</AnalyticsContext.Provider>;
};
