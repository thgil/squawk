import Head from 'next/head'

import Hero from '../components/hero'
import Pricing from '../components/pricing'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Squawk</title>
        <meta name="description" content="Text to Speech" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <script defer data-domain="squawk-ivory.vercel.app" src="https://plausible.io/js/plausible.js"></script>
      </Head>

      <main className="">
        <Hero></Hero>
        <Pricing></Pricing>
      </main>

      <footer className="">
      </footer>
    </div>
  )
}
