import '../styles/globals.css'
import Head from 'next/head'
import Socials from 'components/Socials'
import Signature from 'components/Signature'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Crazy Circular Slider</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta charset="utf-8" />
        <meta name="title" content="Crazy Circular Slider" />
        <meta name="description" content="Crazy Circular Slider" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />

        <meta
          name="description"
          content="Crazy Circular Slider built with React"
        />

        <meta name="msapplication-TileColor" content="#fd5973" />
        <meta
          name="msapplication-TileImage"
          content="https://circular-slider.leman.dev/circular-slider.svg"
        />
        <meta name="theme-color" content="#fd5973" />
        <meta
          name="google-site-verification"
          content="12SzhX8l1tk3jBwLdqfOAbsJ-5DaB-AWcHKd7nJICI8"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://circular-slider.leman.dev/" />
        <meta property="og:title" content="Crazy Circular Slider" />
        <meta
          property="og:description"
          content="Crazy Circular Slider built with React"
        />
        <meta
          property="og:image"
          content="https://circular-slider.leman.dev/preview.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://circular-slider.leman.dev/"
        />
        <meta property="twitter:title" content="Crazy Circular Slider" />
        <meta
          property="twitter:description"
          content="Crazy Circular Slider built with React"
        />
        <meta
          property="twitter:image"
          content="https://circular-slider.leman.dev/preview.png"
        />
      </Head>

      <Socials />
      <Component {...pageProps} />
      <Signature />
    </>
  )
}

export default MyApp
