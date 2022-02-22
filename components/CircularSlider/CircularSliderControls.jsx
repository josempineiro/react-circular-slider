import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useClassNames } from 'hooks'

const areValidSegments = (segments) =>
  segments.reduce((sum, { value }) => value + sum, 0) === 100

const PercetageInput = ({ value, onChange, onFocus, onBlur, ...rest }) => {
  const [focused, setFocused] = useState(false)
  const handleFocus = () => {
    setFocused(true)
    onFocus()
  }
  const handleBlur = () => {
    setFocused(false)
    onBlur()
  }
  return (
    <input
      value={focused ? value : `${value}%`}
      type={focused ? 'number' : 'text'}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={onChange}
      max={100}
      min={0}
      {...rest}
    />
  )
}

PercetageInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

PercetageInput.defaultProps = {
  onFocus: () => null,
  onBlur: () => null,
}

const SegmentsControls = ({
  segments,
  onChange,
  autoIncrement,
  disabled,
  onFocus,
  label,
  onBlur,
}) => {
  const [localSegments, setLocalSegments] = useState(null)
  useEffect(() => {
    if (localSegments) {
      if (areValidSegments(localSegments)) {
        onChange(localSegments)
        setLocalSegments(null)
      }
    }
  }, [localSegments, onChange])
  const handleChangeSegment = (segment, newValue) => {
    if (segment) {
      if (localSegments) {
        setLocalSegments(
          localSegments.map((mapSegment) => {
            if (mapSegment.id === segment.id) {
              return {
                ...mapSegment,
                value: newValue,
              }
            }
            return mapSegment
          })
        )
      } else {
        setLocalSegments(
          segments.map((mapSegment) => {
            if (mapSegment.id === segment.id) {
              return {
                ...mapSegment,
                value: newValue,
              }
            }
            return mapSegment
          })
        )
      }
    }
  }
  const handleCollapseSegment = (segment, collapsed) => {
    const sortByWeightAsc = (a, b) => a.value - b.value
    const sortByWeightDesc = (a, b) => b.value - a.value
    const min = segments
      .filter(({ id, value }) => segment.id !== id && value > 0)
      .sort(sortByWeightAsc)
      .shift()
    const max = segments
      .filter(({ id, value }) => segment.id !== id && value > 0)
      .sort(sortByWeightDesc)
      .shift()
    if (collapsed) {
      setLocalSegments(
        segments.map((mapSegment) => {
          if (mapSegment.id === segment.id) {
            return {
              ...mapSegment,
              value: autoIncrement,
            }
          } else if (mapSegment.id === max.id) {
            return {
              ...mapSegment,
              value: mapSegment.value - autoIncrement,
            }
          }
          return mapSegment
        })
      )
    } else {
      setLocalSegments(
        segments.map((mapSegment) => {
          if (mapSegment.id === segment.id) {
            return {
              ...mapSegment,
              value: 0,
            }
          } else if (mapSegment.id === min.id) {
            return {
              ...mapSegment,
              value: mapSegment.value + segment.value,
            }
          }
          return mapSegment
        })
      )
    }
  }
  const sortedByweight = localSegments || [...segments]
  const handleInputChange = (segment, value) => {
    handleChangeSegment(segment, parseInt(value || 0, 10))
  }
  const { classNames } = useClassNames({ alias: 'SegmentsControls' })
  return (
    <div className={classNames()}>
      {label && <label className={classNames('label')}>{label}</label>}
      {sortedByweight.map((segment) => {
        const { value, label, units } = segment
        const collapsed = value === 0
        const segmentDisabled = segment.disabled || disabled
        return (
          <div
            key={segment.id}
            className={classNames('segment', { disabled: segmentDisabled })}
          >
            <div className={classNames('segmentLabel')}>
              {label}
              {units && <span className={classNames('units')}> ({units})</span>}
            </div>
            <PercetageInput
              className={classNames('input')}
              disabled={segmentDisabled}
              value={value}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={({ target: { value } }) =>
                handleInputChange(segment, value)
              }
            />
          </div>
        )
      })}
    </div>
  )
}

const segmentPropType = PropTypes.shape({
  id: PropTypes.string,
  value: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.string,
})

SegmentsControls.propTypes = {
  segments: PropTypes.arrayOf(segmentPropType),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  autoIncrement: PropTypes.number,
  disabled: PropTypes.bool,
  label: PropTypes.node,
}

SegmentsControls.defaultProps = {
  autoIncrement: 10,
}

SegmentsControls.displayName = 'SegmentsControls'

export default SegmentsControls
