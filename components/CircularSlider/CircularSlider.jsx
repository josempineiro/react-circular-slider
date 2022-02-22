import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useClassNames } from 'hooks'
import CircularSlides from './CircularSlides'

const CircularSlider = ({
  label,
  dataset,
  values,
  onChange,
  disabled,
  onFocus,
  onBlur,
  invert,
  radio,
  minValue,
  maxValue,
}) => {
  const { classNames } = useClassNames({ alias: 'SlidesFieldset' })

  const handleChange = useCallback(
    (newSlideValues) => {
      onChange(newSlideValues)
    },
    [onChange, dataset]
  )

  return (
    <div className={classNames([{ disabled }])}>
      <CircularSlides
        invert={invert}
        disabled={disabled}
        radio={radio}
        dataset={dataset}
        values={values}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        maxValue={maxValue}
        minValue={minValue}
      />
    </div>
  )
}

CircularSlider.propTypes = {
  label: PropTypes.node,
  disabled: PropTypes.bool,
  dataset: PropTypes.array,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  radio: PropTypes.number,
  invert: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
}

CircularSlider.defaultProps = {
  radio: 122,
}

CircularSlider.displayName = 'CircularSlider'

export default CircularSlider
