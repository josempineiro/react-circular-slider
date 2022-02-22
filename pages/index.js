import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CircularSlider from 'components/CircularSlider'

export default function Home({ socials }) {
  const [values, setValues] = useState([
    { id: 'cherry', value: 33 },
    { id: 'kiwi', value: 33 },
    { id: 'blueberry', value: 34 },
  ])
  const dataset = [
    { id: 'cherry', label: 'cherry', color: 'cherry' },
    { id: 'kiwi', label: 'kiwi', color: 'kiwi' },
    { id: 'blueberry', label: 'blueberry', color: 'blueberry' },
  ]
  const onChange = (newValue) => {
    setValues((values) =>
      values.map((value, index) => ({
        ...value,
        ...newValue.find(({ id }) => id === value.id),
      }))
    )
  }
  const style = values.reduce(
    (styles, { id, value }, index) => ({
      ...styles,
      [`--${id}-percent`]: `${value}%`,
    }),
    {}
  )
  return (
    <div className={styles.container}>
      <Head>
        <title>Crazy Circular Slider</title>
        <meta name="description" content="Crazy Circular Slider" />
        <meta name="title" content="Crazy Circular Slider" />
        <meta charset="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />

        <meta
          name="description"
          content="Crazy Circular Slider built with React"
        />

        <meta name="msapplication-TileColor" content="#fd5973" />
        <meta
          name="msapplication-TileImage"
          content="/icons/CricularSlider.svg"
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
          content="https://circular-slider.leman.dev/images/preview.png"
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
          content="https://circular-slider.leman.dev/images/preview.png"
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title} style={style}>
          Crazy Circular Slider
        </h1>
        <CircularSlider
          dataset={dataset}
          values={values}
          radio={122}
          onChange={onChange}
          maxValue={100}
          minValue={5}
        />
      </main>
    </div>
  )
}
