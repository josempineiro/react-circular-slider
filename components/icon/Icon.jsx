import classnames from 'classnames'
import Github from './Github'
import LinkedIn from './LinkedIn'
import styles from './Icon.module.css'

const getIcon = ({ name, ...rest }) => {
  switch (name) {
    case 'Github':
      return <Github {...rest} />
    case 'LinkedIn':
      return <LinkedIn {...rest} />
    default:
      return null
  }
}

const Icon = (props) => {
  return (
    <i className={classnames([styles.icon, styles[props.name]])}>
      {getIcon(props)}
    </i>
  )
}

export default Icon
