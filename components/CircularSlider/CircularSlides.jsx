import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useClassNames } from 'hooks'
import CircularSliderNodes from './CircularSliderNodes'
import {
  angleToPercent,
  fromPercentToAngle,
  normaliseAngle,
  getMouseLocation,
  generateClipPathFromAngle,
  buildSegmentStyles,
  normalize,
  BASE_ROTATION,
} from './utils'

const CircularSlides = ({
  onChange,
  onFocus,
  onBlur,
  segments,
  minSegment,
  maxSegment,
  disabled,
  radio,
  invert,
}) => {
  const segmentsRef = useRef()
  const [globalOffset, setGlobalOffset] = useState(0)
  const [hoverSegmentId, setHoverSegmentId] = useState(null)
  const [selectedSegmentId, setSelectedSegmentId] = useState(null)

  const localSegments = segments.map((segment, index, vals) => ({
    ...segment,
    index,
    clip: generateClipPathFromAngle(fromPercentToAngle(segment.value)),
    arcAngle: fromPercentToAngle(segment.value),
    offsetAngle: vals
      .slice(0, index)
      .reduce((angles, { value }) => angles + fromPercentToAngle(value), 0),
  }))

  const visibleSegments = localSegments.filter(({ value }) => value > 0)

  const getSegmentById = (segmentId) =>
    localSegments.find(({ id }) => id === segmentId)

  const selectedSegment = (() => {
    if (selectedSegmentId) {
      return getSegmentById(selectedSegmentId)
    } else if (hoverSegmentId) {
      return getSegmentById(hoverSegmentId)
    }
    return null
  })()

  const localMaxSegment = (() => {
    const minSegmentSum = minSegment * (segments.length - 1)
    const maxAcceptedSegment = maxSegment - minSegmentSum
    return Math.min(maxSegment, maxAcceptedSegment)
  })()

  const sanitizeSegment = (segment) =>
    Math.max(Math.min(localMaxSegment, segment), minSegment)

  const getSegmentsFromIndex = (index, clockwise) => {
    if (clockwise) {
      return [
        ...localSegments.slice(index + 1),
        ...localSegments.slice(0, index + 1),
      ]
    }
    return [
      ...localSegments.slice(0, index + 1).reverse(),
      ...localSegments.slice(index + 2).reverse(),
    ]
  }

  const getReducedSegmentIndex = (index, deltaPercent) => {
    const clockwise = deltaPercent > 0
    const candidates = getSegmentsFromIndex(index, clockwise).filter(
      (candidateReducibleSegment) => {
        const newPercent =
          candidateReducibleSegment.value + deltaPercent * (clockwise ? -1 : 1)
        return newPercent >= minSegment && newPercent <= localMaxSegment
      }
    )
    const candidate = candidates.find((candidateReducibleSegment) => {
      const newPercent =
        candidateReducibleSegment.value + deltaPercent * (clockwise ? -1 : 1)
      return newPercent >= minSegment && newPercent <= localMaxSegment
    })
    return candidate ? candidate.index : null
  }
  const getAumentedSegmentIndex = (index, deltaPercent) => {
    const clockwise = deltaPercent > 0
    let candidateIndex = index
    if (!clockwise) {
      const isLast = index === localSegments.length - 1
      candidateIndex = isLast ? 0 : index + 1
    }
    const candidate = localSegments[candidateIndex]
    if (candidate.value < localMaxSegment) {
      return candidateIndex
    }
    return null
  }

  const updateSegments = (index, deltaSegment) => {
    const reducedSegmentIndex = getReducedSegmentIndex(index, deltaSegment)
    const aumentedSegmentIndex = getAumentedSegmentIndex(index, deltaSegment)
    onChange(
      localSegments.map((segment) => {
        if (segment.index === reducedSegmentIndex) {
          return {
            ...segment,
            value: sanitizeSegment(segment.value - Math.abs(deltaSegment)),
          }
        }
        if (segment.index === aumentedSegmentIndex) {
          return {
            ...segment,
            value: sanitizeSegment(segment.value + Math.abs(deltaSegment)),
          }
        }
        return segment
      })
    )
  }

  const updateOffset = (index, deltaSegment) => {
    const clockwise = deltaSegment > 0
    const reducedSegmentIndex = getReducedSegmentIndex(index, deltaSegment)
    const aumentedSegmentIndex = getAumentedSegmentIndex(index, deltaSegment)
    if (
      isNaN(parseInt(reducedSegmentIndex, 10)) ||
      isNaN(parseInt(aumentedSegmentIndex, 10))
    ) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSegment))
    } else if (reducedSegmentIndex === aumentedSegmentIndex) {
      setGlobalOffset(globalOffset - fromPercentToAngle(deltaSegment))
    } else if (index === localSegments.length - 1) {
      if (clockwise) {
        setGlobalOffset(globalOffset + fromPercentToAngle(deltaSegment))
      } else {
        setGlobalOffset(globalOffset + fromPercentToAngle(deltaSegment))
      }
    } else if (reducedSegmentIndex < aumentedSegmentIndex && clockwise) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSegment))
    } else if (reducedSegmentIndex > aumentedSegmentIndex && !clockwise) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSegment))
    } else if (aumentedSegmentIndex > reducedSegmentIndex && clockwise) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSegment))
    }
  }

  const changePercent = (index, deltaPercent) => {
    const reducedSegmentIndex = getReducedSegmentIndex(index, deltaPercent)
    const aumentedSegmentIndex = getAumentedSegmentIndex(index, deltaPercent)
    const noUpdateSegments =
      isNaN(parseInt(reducedSegmentIndex, 10)) ||
      isNaN(parseInt(aumentedSegmentIndex, 10)) ||
      reducedSegmentIndex === aumentedSegmentIndex
    if (noUpdateSegments) {
      updateOffset(index, deltaPercent)
    } else {
      updateOffset(index, deltaPercent)
      updateSegments(index, deltaPercent)
    }
  }
  const handleMouseMove = (event) => {
    if (selectedSegmentId === null) {
      return
    }
    const angleIndex = localSegments.findIndex(
      ({ id }) => id === selectedSegmentId
    )
    const angle = localSegments.find(({ id }) => id === selectedSegmentId)
    const dragLocation = getMouseLocation(event, segmentsRef.current)
    const dx = dragLocation.x - radio
    const dy = dragLocation.y - radio
    const newPercent = angleToPercent(
      normaliseAngle(
        Math.atan2(dy, dx) + BASE_ROTATION - (angle.offsetAngle + globalOffset)
      )
    )
    const oldPercent = angleToPercent(angle.arcAngle)
    if (Math.abs(newPercent - oldPercent) > 1) {
      changePercent(angleIndex, normalize(newPercent - oldPercent))
    }
  }

  const handleMouseEnterToNode = (segmentId) => {
    setHoverSegmentId(segmentId)
  }
  const handleMouseLeaveFromNode = () => {
    setHoverSegmentId(null)
  }

  const handleMouseDown = (optionId) => {
    if (!disabled) {
      setSelectedSegmentId(optionId)
      onFocus()
    }
  }

  const handleMouseUp = () => {
    if (selectedSegmentId !== null) {
      setSelectedSegmentId(null)
      onBlur()
    }
  }

  const { classNames } = useClassNames({ alias: 'Segments' })

  return (
    <div
      className={classNames([{ disabled }, { invert }])}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div ref={segmentsRef} radio={radio} className={classNames('segments')}>
        <div
          className={classNames('rotator')}
          style={{
            transform: `rotate(${globalOffset}rad)`,
          }}
        >
          {visibleSegments.map((segment) => (
            <div
              className={classNames('segment', { color: segment.color })}
              key={segment.id}
              style={buildSegmentStyles(segment)}
            />
          ))}
        </div>
        <CircularSliderNodes
          globalOffset={globalOffset}
          segments={localSegments}
          selectedSegmentId={selectedSegmentId}
          onMouseEnter={handleMouseEnterToNode}
          onMouseLeave={handleMouseLeaveFromNode}
          onMouseDown={handleMouseDown}
          invert={invert}
          radio={radio}
        />
        {selectedSegment && (
          <div className={classNames('centerInfo')}>
            <div className={classNames('label')}>{selectedSegment.label}</div>
            <div className={classNames('value')}>{selectedSegment.value}</div>
          </div>
        )}
      </div>
    </div>
  )
}

CircularSlides.propTypes = {
  segments: PropTypes.array,
  minSegment: PropTypes.number,
  maxSegment: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  radio: PropTypes.number,
  invert: PropTypes.bool,
}

CircularSlides.defaultProps = {
  onChange: () => null,
  onFocus: () => null,
  onBlur: () => null,
}

CircularSlides.displayName = 'CircularSlides'

export default CircularSlides
