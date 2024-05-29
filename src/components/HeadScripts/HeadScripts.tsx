import Script from 'next/script';

function isProduction(): boolean {
  return process.env.NEXT_PUBLIC_ENV === 'production';
}

export function HeadScripts(): JSX.Element | null {
  if (!isProduction()) {
    return null;
  }

  return (
    <>
      <Script
        id="segment"
        dangerouslySetInnerHTML={{
          __html: `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="q9lHtx1XEm0aUD9vQWv5gUGpyRQ2xGW3";;analytics.SNIPPET_VERSION="4.15.3";
            analytics.load("q9lHtx1XEm0aUD9vQWv5gUGpyRQ2xGW3");
            analytics.page();
          }}();`,
        }}
      />
      <Script
        id="pixel"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '945611906078200');
          fbq('track', 'PageView');`,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{display:"none"}}
          src="https://www.facebook.com/tr?id=945611906078200&ev=PageView&noscript=1"
        />
      </noscript>
    </>
  );
}
