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
