import React, { useEffect, useRef, useState } from 'react'
import { IIconDropdown } from '../../Dropdown/interface'
import { Option } from '../../Dropdown/CustomComponent'
import { StyledSelectWrapper } from '../StyledIconDropdown'
import Select, { components } from 'react-select'
import DropdownUniversalStyled from '../Styles/DropdownUniversalStyled'
import Position from '@ui-library/components/atoms/Position'

const DropdownUniversal = ({
  defaultProps,
}: {
    defaultProps: IIconDropdown
}) => {
  const {
    options,
    value,
    primary,
    intent,
    iconButtonDetails,
    width,
    theme,
    children,
    onChange,
    customStyle,
    menuIsOpen: menuOpen,
    optionComponent,
  } = defaultProps

  const node = useRef(null)

  const [menuIsOpen, setMenuIsOpen] = useState(!!menuOpen) // we are keeping this to send to button as on open we have to make button blue

  const handleOutsideClick = (e: any) => {
    const n = (node?.current as unknown) as Node
    if (n?.contains(e?.target)) return
    setMenuIsOpen(false)
  }

  useEffect(() => {
    setMenuIsOpen(!!menuOpen)
  }, [menuOpen])

  // if passing children from outside then only close on outside click
  useEffect(() => {
    children && document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      children && document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <Position type="relative" style={{ width: '100%' }}>
      {children &&
                children({ selectedOption: value as any,
                  menuIsOpen,
                  setMenuIsOpen })}
      <StyledSelectWrapper
        width={width}
        onClick={(e: any) => {
          e.stopPropagation()
        }}
        ref={node}
      >
        <Select
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: () => null,
            Option,
            Menu: (props) => (
              <components.Menu {...props} className="menuAnimate" />
            ),
          }}
          styles={customStyle || DropdownUniversalStyled(width, theme, false)}
          options={options}
          value={value}
          width={width}
          primary={primary}
          intent={intent}
          openMenuOnClick={false}
          iconButtonDetails={iconButtonDetails}
          theme={theme}
          optionComponent={optionComponent}
          menuIsOpen={menuIsOpen}
          onChange={(input: any) => {
            const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
            obj?.forEach((e) => {
              e.remove()
            })
            onChange && onChange(input)
          }}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
        />
      </StyledSelectWrapper>
    </Position>
  )
}

export default DropdownUniversal