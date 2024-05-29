import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useLoadScript } from '@react-google-maps/api';
import 'react-toastify/dist/ReactToastify.css';
import Hotjar from '@hotjar/browser';

import { HeadScripts } from '../components/HeadScripts/HeadScripts';

import { wrapper } from '../store/store';

import 'video-react/dist/video-react.css';

import '../styles/index.scss';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP!,
    libraries: ['places'],
  });

  const siteId = 3175373;
  const hotjarVersion = 6;

  Hotjar.init(siteId, hotjarVersion);

  // Initializing with `debug` option:
  Hotjar.init(siteId, hotjarVersion, {
    debug: true,
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <link rel="icon" href="favicon-16x16.ico" sizes="16x16" />
        <link rel="icon" href="favicon-32x32.ico" sizes="32x32" />
        <link rel="shortcut icon" href="favicon-16x16.ico" />

        <title>Plannet - We plan, you travel</title>
        <meta
          name="description"
          content="A better way to book, informed by locals and people you trust."
        />

        <meta property="og:url" content="https://plannet.io" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Plannet - We plan, you travel" />
        <meta
          property="og:description"
          content="A better way to book, informed by locals and people you trust."
        />
        <meta
          property="og:image"
          content="https://plannet-web-staging.herokuapp.com/assets/images/landingpage/open-graph.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="open.plannet.io" />
        <meta property="twitter:url" content="https://plannet.io" />
        <meta name="twitter:title" content="Plannet - We plan, you travel" />
        <meta
          name="twitter:description"
          content="A better way to book, informed by locals and people you trust."
        />
        <meta
          name="twitter:image"
          content="https://plannet-web-staging.herokuapp.com/assets/images/landingpage/open-graph.png"
        />
        {/* Hotjar Tracking Code for https://plannet.io/ */}
        <script src="/public/static/hotjar.js" />
      </Head>
      <HeadScripts />
      <div className="relative">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
      <Provider store={wrapper.useWrappedStore({}).store}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
      <div id="map" />
    </>
  );
}
