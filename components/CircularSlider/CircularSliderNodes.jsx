import React from 'react'
import PropTypes from 'prop-types'
import { useClassNames } from 'hooks'
import { buildNodeStyles } from './utils'

const CircularSliderNodes = ({
  globalOffset,
  radio,
  slides,
  selectedSlideId,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
}) => {
  const isSelectedSlide = (slide) => selectedSlideId === slide.id

  const isVisibleSlide = ({ value }) => value > 0
  const { classNames } = useClassNames({ alias: 'SlidesNodes' })
  return (
    <div className={classNames()}>
      <div className={classNames('nodes')}>
        {slides.filter(isVisibleSlide).map((slide) => (
          <div
            key={slide.id}
            className={classNames('node', [
              { color: slide.color },
              { selected: isSelectedSlide(slide) },
            ])}
            onMouseEnter={() => onMouseEnter(slide.id)}
            onMouseLeave={() => onMouseLeave(slide.id)}
            onMouseDown={(event) => {
              event.stopPropagation()
              onMouseDown(slide.id)
            }}
            onTouchStart={() => onMouseDown(slide.id)}
            style={buildNodeStyles(
              slide.arcAngle + slide.offsetAngle + globalOffset,
              radio
            )}
          />
        ))}
      </div>
      <div className={classNames('nodesInfo')}>
        {slides.filter(isVisibleSlide).map((option) => (
          <div
            key={option.id}
            style={buildNodeStyles(
              option.arcAngle + option.offsetAngle + globalOffset,
              radio + 32
            )}
            className={classNames('nodeInfo')}
          >
            <span>{option.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

CircularSliderNodes.propTypes = {
  slides: PropTypes.array,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  globalOffset: PropTypes.number,
  selectedSlideId: PropTypes.string,
  radio: PropTypes.number,
}

CircularSliderNodes.displayName = 'CircularSliderNodes'

export default CircularSliderNodes
