import { useEffect, useState } from 'react'
import Icon from 'components/icon'
import styles from './Socials.module.css'

const Socials = () => {
  const [socials, setSocials] = useState([])
  useEffect(() => {
    fetch(`/api/socials`)
      .then((res) => res.json())
      .then((socialsDto) => {
        setSocials(() => socialsDto)
      })
  }, [])
  return (
    <div className={styles.socials}>
      <ul className={styles.list}>
        {socials.map((social) => (
          <li key={social.href} className={styles.item}>
            <a
              href={social.href}
              title={social.icon}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name={social.icon} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Socials
