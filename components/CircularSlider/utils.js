export const TAU = Math.PI * 2

export function angleToPercent(angle) {
  return (angle * 100) / TAU
}

export function fromPercentToAngle(percent) {
  return normaliseAngle((percent * TAU) / 100)
}

function mod(n, m) {
  return ((n % m) + m) % m
}

export function normaliseAngle(angle) {
  return mod(angle, TAU)
}

export const getMouseLocation = (evt, target) => {
  const rect = target.getBoundingClientRect()
  if (evt.clientX) {
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    }
  }
  return {
    x: evt.targetTouches[0].clientX - rect.left,
    y: evt.targetTouches[0].clientY - rect.top,
  }
}

export const BASE_ROTATION = Math.PI / 2

export const buildSlideStyles = (slide) => ({
  transform: `rotate(${slide.offsetAngle}rad)`,
  clipPath: `polygon(${slide.clipPath.toString()})`,
  borderColor: slide.color,
})

export const normalize = (deltaPercent) => {
  if (deltaPercent < 0) {
    return Math.round(deltaPercent) ? Math.max(-4, Math.round(deltaPercent)) : 0
  }
  return Math.round(deltaPercent) ? Math.min(4, Math.round(deltaPercent)) : 0
}

/* eslint-disable  max-statements */
export const generateClipPathFromAngle = (angle) => {
  const clipPath = []
  if (angle === 0) {
    return [...clipPath, '0 0', '0 100%', '100% 100%', '100% 0']
  }
  clipPath.push('50% 50%', '50% 0')
  // angle < 45deg 12.5%
  if (angle < Math.PI / 4) {
    return [...clipPath, `${50 + 50 * Math.tan(angle)}% 0`]
  }
  clipPath.push('100% 0')
  // angle < 90deg 25%
  if (angle <= Math.PI / 2) {
    return [...clipPath, `100% ${50 - 50 * Math.tan(Math.PI / 2 - angle)}%`]
  }
  clipPath.push('100% 50%')
  // angle < 135deg 37.5%
  if (angle <= (Math.PI * 3) / 4) {
    return [...clipPath, `100% ${50 + 50 * Math.tan(angle - Math.PI / 2)}%`]
  }
  clipPath.push('100% 100%')
  // angle < 180deg 50%
  if (angle <= Math.PI) {
    return [...clipPath, `${50 + 50 * Math.tan(Math.PI - angle)}% 100%`]
  }
  clipPath.push('50% 100%')
  // angle < 235deg
  if (angle < (Math.PI * 5) / 4) {
    return [...clipPath, `${50 - 50 * Math.tan(Math.PI + angle)}% 100%`]
  }
  clipPath.push('0 100%')
  // angle < 270deg 75%
  if (angle <= (Math.PI * 3) / 2) {
    return [...clipPath, `0 ${50 + 50 * Math.tan((Math.PI * 3) / 2 - angle)}% `]
  }
  clipPath.push('0 50%')
  // angle < 315deg 87.5%
  if (angle <= (Math.PI * 7) / 4) {
    return [...clipPath, `0 ${50 - 50 * Math.tan((Math.PI * 3) / 2 + angle)}% `]
  }
  clipPath.push('0 0')
  // angle < 360
  if (angle < TAU) {
    return [...clipPath, `${50 - 50 * Math.tan(TAU - angle)}% 0`]
  }
  return [...clipPath, '50% 0']
}

export const buildNodeStyles = (arcAngle, radius, selected) => ({
  left: (radius - 2) * Math.cos(arcAngle - BASE_ROTATION),
  top: (radius - 2) * Math.sin(arcAngle - BASE_ROTATION),
  zoom: selected ? 1.1 : 0,
})
