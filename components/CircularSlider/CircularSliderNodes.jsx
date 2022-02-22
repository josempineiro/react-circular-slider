import React from 'react'
import PropTypes from 'prop-types'
import { useClassNames } from 'hooks'
import {
  fromPercentToAngle,
  generateClipPathFromAngle,
  buildNodeStyles,
} from './utils'

const CircularSliderNodes = ({
  globalOffset,
  radio,
  segments,
  selectedSegmentId,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
}) => {
  const localSegments = segments.map((segment, index, vals) => ({
    ...segment,
    index,
    clip: generateClipPathFromAngle(fromPercentToAngle(segment.value)),
    arcAngle: fromPercentToAngle(segment.value),
    offsetAngle: vals
      .slice(0, index)
      .reduce((angles, { value }) => angles + fromPercentToAngle(value), 0),
  }))

  const isSelectedSegment = (segment) => selectedSegmentId === segment.id

  const visibleSegments = ({ value }) => value > 0
  const { classNames } = useClassNames({ alias: 'SegmentsNodes' })
  return (
    <div className={classNames()}>
      <div className={classNames('nodes')}>
        {localSegments.filter(visibleSegments).map((segment) => (
          <div
            key={segment.id}
            className={classNames('node', [
              { color: segment.color },
              { selected: isSelectedSegment(segment) },
            ])}
            onMouseEnter={() => onMouseEnter(segment.id)}
            onMouseLeave={() => onMouseLeave(segment.id)}
            onMouseDown={() => onMouseDown(segment.id)}
            style={buildNodeStyles(
              segment.arcAngle + segment.offsetAngle + globalOffset,
              radio
            )}
          />
        ))}
      </div>
      <div className={classNames('nodesInfo')}>
        {localSegments.filter(visibleSegments).map((option) => (
          <div
            key={option.id}
            style={buildNodeStyles(
              option.arcAngle + option.offsetAngle + globalOffset,
              radio + 32
            )}
            className={classNames('nodeInfo')}
          >
            {option.value}%
          </div>
        ))}
      </div>
    </div>
  )
}

CircularSliderNodes.propTypes = {
  segments: PropTypes.array,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  globalOffset: PropTypes.number,
  selectedSegmentId: PropTypes.string,
  radio: PropTypes.number,
}

CircularSliderNodes.displayName = 'CircularSliderNodes'

export default CircularSliderNodes
