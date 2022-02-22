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
  buildSlideStyles,
  normalize,
  BASE_ROTATION,
} from './utils'

const CircularSlides = ({
  onChange,
  onFocus,
  onBlur,
  dataset,
  values,
  minValue,
  maxValue,
  disabled,
  radio,
  invert,
}) => {
  const slidesRef = useRef()
  const [globalOffset, setGlobalOffset] = useState(0)
  const [hoverSlideId, setHoverSlideId] = useState(null)
  const [selectedSlideId, setSelectedSlideId] = useState(null)

  const findSlideValue = (slide) =>
    values.find(({ id }) => id === slide.id).value

  const localSlides = dataset.map((data, index, slides) => {
    const slideValue = findSlideValue(data)
    return {
      ...data,
      index,
      value: slideValue,
      clipPath: generateClipPathFromAngle(fromPercentToAngle(slideValue)),
      arcAngle: fromPercentToAngle(slideValue),
      offsetAngle: slides
        .slice(0, index)
        .reduce(
          (angles, slide) => angles + fromPercentToAngle(findSlideValue(slide)),
          0
        ),
    }
  })

  const visibleSlides = localSlides.filter(({ value }) => value > 0)

  const getSlideById = (slideId) => localSlides.find(({ id }) => id === slideId)

  const selectedSlide = (() => {
    if (selectedSlideId) {
      return getSlideById(selectedSlideId)
    } else if (hoverSlideId) {
      return getSlideById(hoverSlideId)
    }
    return null
  })()

  const localMaxSlideValue = (() => {
    const minValueSum = minValue * (dataset.length - 1)
    const maxAcceptedSlide = maxValue - minValueSum
    return Math.min(maxValue, maxAcceptedSlide)
  })()

  const sanitizeSlideValue = (slideValue) =>
    Math.max(Math.min(localMaxSlideValue, slideValue), minValue)

  const getSlideFromIndex = (index, clockwise) => {
    if (clockwise) {
      return [
        ...localSlides.slice(index + 1),
        ...localSlides.slice(0, index + 1),
      ]
    }
    return [
      ...localSlides.slice(0, index + 1).reverse(),
      ...localSlides.slice(index + 2).reverse(),
    ]
  }

  const getReducedSlideIndex = (index, deltaPercent) => {
    const clockwise = deltaPercent > 0
    const candidates = getSlideFromIndex(index, clockwise).filter(
      (candidateReducibleSlide) => {
        const newPercent =
          candidateReducibleSlide.value + deltaPercent * (clockwise ? -1 : 1)
        return newPercent >= minValue && newPercent <= localMaxSlideValue
      }
    )
    const candidate = candidates.find((candidateReducibleSlide) => {
      const newPercent =
        candidateReducibleSlide.value + deltaPercent * (clockwise ? -1 : 1)
      return newPercent >= minValue && newPercent <= localMaxSlideValue
    })
    return candidate ? candidate.index : null
  }
  const getAumentedSlideIndex = (index, deltaPercent) => {
    const clockwise = deltaPercent > 0
    let candidateIndex = index
    if (!clockwise) {
      const isLast = index === localSlides.length - 1
      candidateIndex = isLast ? 0 : index + 1
    }
    const candidate = localSlides[candidateIndex]
    if (candidate.value < localMaxSlideValue) {
      return candidateIndex
    }
    return null
  }

  const updateSlides = (index, deltaSlide) => {
    const reducedSlideIndex = getReducedSlideIndex(index, deltaSlide)
    const aumentedSlideIndex = getAumentedSlideIndex(index, deltaSlide)
    onChange(
      localSlides.map((slide) => {
        if (slide.index === reducedSlideIndex) {
          return {
            ...slide,
            value: sanitizeSlideValue(slide.value - Math.abs(deltaSlide)),
          }
        }
        if (slide.index === aumentedSlideIndex) {
          return {
            ...slide,
            value: sanitizeSlideValue(slide.value + Math.abs(deltaSlide)),
          }
        }
        return slide
      })
    )
  }

  const updateOffset = (index, deltaSlide) => {
    const clockwise = deltaSlide > 0
    const reducedSlideIndex = getReducedSlideIndex(index, deltaSlide)
    const aumentedSlideIndex = getAumentedSlideIndex(index, deltaSlide)
    if (
      isNaN(parseInt(reducedSlideIndex, 10)) ||
      isNaN(parseInt(aumentedSlideIndex, 10))
    ) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSlide))
    } else if (reducedSlideIndex === aumentedSlideIndex) {
      setGlobalOffset(globalOffset - fromPercentToAngle(deltaSlide))
    } else if (index === localSlides.length - 1) {
      if (clockwise) {
        setGlobalOffset(globalOffset + fromPercentToAngle(deltaSlide))
      } else {
        setGlobalOffset(globalOffset + fromPercentToAngle(deltaSlide))
      }
    } else if (reducedSlideIndex < aumentedSlideIndex && clockwise) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSlide))
    } else if (reducedSlideIndex > aumentedSlideIndex && !clockwise) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSlide))
    } else if (aumentedSlideIndex > reducedSlideIndex && clockwise) {
      setGlobalOffset(globalOffset + fromPercentToAngle(deltaSlide))
    }
  }

  const changePercent = (index, deltaPercent) => {
    const reducedSlideIndex = getReducedSlideIndex(index, deltaPercent)
    const aumentedSlideIndex = getAumentedSlideIndex(index, deltaPercent)
    const noUpdateSlides =
      isNaN(parseInt(reducedSlideIndex, 10)) ||
      isNaN(parseInt(aumentedSlideIndex, 10)) ||
      reducedSlideIndex === aumentedSlideIndex
    if (noUpdateSlides) {
      updateOffset(index, deltaPercent)
    } else {
      updateOffset(index, deltaPercent)
      updateSlides(index, deltaPercent)
    }
  }
  const handleMouseMove = (event) => {
    event.stopPropagation()
    if (selectedSlideId === null) {
      return
    }
    const angleIndex = localSlides.findIndex(({ id }) => id === selectedSlideId)
    const angle = localSlides.find(({ id }) => id === selectedSlideId)
    const dragLocation = getMouseLocation(event, slidesRef.current)
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

  const handleMouseEnterToNode = (slideId) => {
    setHoverSlideId(slideId)
  }
  const handleMouseLeaveFromNode = () => {
    setHoverSlideId(null)
  }

  const handleMouseDown = (optionId) => {
    if (!disabled) {
      setSelectedSlideId(optionId)
      onFocus()
    }
  }

  const handleMouseUp = () => {
    if (selectedSlideId !== null) {
      setSelectedSlideId(null)
      onBlur()
    }
  }

  const { classNames } = useClassNames({ alias: 'Slides' })

  return (
    <div
      className={classNames([{ disabled }, { invert }])}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div ref={slidesRef} radio={radio} className={classNames('segments')}>
        <div
          className={classNames('rotator')}
          style={{
            transform: `rotate(${globalOffset}rad)`,
          }}
        >
          {visibleSlides.map((slide) => (
            <div
              className={classNames('segment', { color: slide.color })}
              key={slide.id}
              style={buildSlideStyles(slide)}
            />
          ))}
        </div>
        <CircularSliderNodes
          globalOffset={globalOffset}
          slides={localSlides}
          values={values}
          selectedSlideId={selectedSlideId}
          onMouseEnter={handleMouseEnterToNode}
          onMouseLeave={handleMouseLeaveFromNode}
          onMouseDown={handleMouseDown}
          invert={invert}
          radio={radio}
        />
        {selectedSlide && (
          <div className={classNames('centerInfo')}>
            <div className={classNames('label')}>{selectedSlide.label}</div>
            <div className={classNames('value')}>{selectedSlide.value}</div>
          </div>
        )}
      </div>
    </div>
  )
}

CircularSlides.propTypes = {
  dataset: PropTypes.array,
  values: PropTypes.array,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
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
