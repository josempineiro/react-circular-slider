export const useClassNames = ({
  className = '',
  alias = '',
  modifierChar = '___',
  elementChar = '_',
  ...restProps
}) => {
  const parseModifier = (modifier) => {
    if (!modifier || !(modifier instanceof Object)) {
      throw Error('Modifier is required and should be an Object')
    } else {
      return Object.keys(modifier)
        .map((modifierId) => {
          const modifierValue = modifier[modifierId]
          if (typeof modifierValue === 'boolean') {
            if (modifierValue) {
              return `${modifierChar}${modifierId}`.trim()
            }
            return ''
          } else if (
            typeof modifierValue === 'string' ||
            typeof modifierValue === 'number'
          ) {
            return `${modifierChar}${modifierValue}`.trim()
          }
          return ''
        })
        .join('')
    }
  }
  const parseToElementModifier = (element, modifier) => {
    if (!modifier) {
      return ''
    } else if (modifier instanceof Array) {
      const modifierString = modifier
        .map((modifier) => parseToElementModifier(element, modifier))
        .join(' ')
      if (modifierString) {
        return `${modifierString}`.trim()
      }
      return ''
    }
    const modifierString = parseModifier(modifier)
    if (modifierString) {
      return `${element}${modifierString}`.trim()
    }
    return ''
  }
  const classNames = (...options) => {
    const block = alias
    if (!options || !options.length) {
      return block
    }
    if (typeof options[0] === 'string') {
      const element = options[0]
      const blockElement = `${block}${elementChar}${element}`.trim()
      let blockElementModifier = ''
      if (options[1]) {
        blockElementModifier = parseToElementModifier(blockElement, options[1])
      }
      return `${blockElement} ${blockElementModifier}`.trim()
    } else if (options[0] instanceof Array) {
      const modifier = options[0]
        .map((modifiers) => parseToElementModifier(block, modifiers))
        .join(` `)
        .trim()
      return `${block} ${modifier}`.trim()
    } else if (options[0] instanceof Object) {
      const blockModifier = parseToElementModifier(block, options[0])
      return `${block} ${blockModifier}`.trim()
    }
    return block
  }
  return {
    className,
    classNames,
    ...restProps,
  }
}

/**
 * className({ trigger: {
 * }})
 *
 */
export default useClassNames
