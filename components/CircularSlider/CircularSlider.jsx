import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useClassNames } from 'hooks'
import SegmentsControls from './CircularSliderControls'
import Segments from './CircularSlides'

const CircularSlider = ({
  label,
  segments,
  onChange,
  disabled,
  onFocus,
  onBlur,
  className,
  invert,
  radio,
}) => {
  const { classNames } = useClassNames({ alias: 'SegmentsFieldset' })

  const findSegmentById = (segments, id) =>
    segments.find((segment) => id === segment.id)

  const handleChange = useCallback(
    (newSegments) => {
      const updatedSegments = segments.map((segment) => {
        if (findSegmentById(newSegments, segment.id)) {
          return findSegmentById(newSegments, segment.id)
        }
        return segment
      })
      onChange(updatedSegments.map(({ id, value }) => ({ id, value })))
    },
    [onChange, segments]
  )

  const visibleSegments = segments.filter(({ value }) => value > 0)

  return (
    <div
      className={`${className || ''} ${classNames([
        { invert },
        { disabled },
      ])}`.trim()}
    >
      <SegmentsControls
        label={label}
        invert={invert}
        disabled={disabled}
        segments={segments}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Segments
        invert={invert}
        disabled={disabled}
        radio={radio}
        segments={visibleSegments}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        maxSegment={100}
      />
    </div>
  )
}

CircularSlider.propTypes = {
  label: PropTypes.node,
  disabled: PropTypes.bool,
  segments: PropTypes.array,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  radio: PropTypes.number,
  invert: PropTypes.bool,
}

CircularSlider.defaultProps = {
  radio: 122,
}

CircularSlider.displayName = 'CircularSlider'

export default CircularSlider
