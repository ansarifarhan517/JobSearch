import React from 'react'
import Select, { components } from 'react-select'
import { IDefaultProps } from '../interface'
import { LoadingIndicator, Control } from '../CustomComponent'
const DefaultDropDown = ({ defaultValue }: { defaultValue: IDefaultProps }) => {
  const {
    options,
    value,
    isLoading,
    placeholder = '',
    onInputChange,
    onChange,
    onFocus,
    isSearchable,
    disabled,
  } = defaultValue
  return (
    <Select
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: () => null,
        LoadingIndicator,
        Control,
        Menu: (props) => <components.Menu {...props} className="menuAnimate" />,
      }}
      // styles={ButtonDropdownStyled()}
      options={options}
      value={value}
      isLoading={isLoading}
      placeholder={placeholder}
      onInputChange={onInputChange}
      onChange={(input: any) => {
        const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
        obj?.forEach((e) => {
          e.remove()
        })
        onChange && onChange(input)
      }}
      onFocus={onFocus}
      isSearchable={isSearchable}
      isDisabled={disabled}
    />
  )
}

export default DefaultDropDown