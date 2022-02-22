import '../styles/globals.css'
import Socials from 'components/Socials'
import Signature from 'components/Signature'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Socials />
      <Component {...pageProps} />
      <Signature />
    </>
  )
}

export default MyApp
