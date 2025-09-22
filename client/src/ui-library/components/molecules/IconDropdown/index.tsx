import React, { useContext, useEffect, useState } from 'react'
import DropdownUniversal from './Variant/DropdownUniversal'
import { ISelectProps, OptionType } from '../Dropdown/interface'
import { ThemeContext } from 'styled-components'
import { IconDropdownDropdownStyled } from './StyledIconDropdown'
import BreadCrumb from './Variant/BreadCrumb'
import { OnChangeValue } from 'react-select'

const IconDropdown = ({
  id,
  variant = 'button-dropdown',
  width = 'auto',
  optionList = [],
  iconButtonDetails = [],
  onChange = () => { },
  primary,
  intent,
  value,
  placeholder,
  showDownArrow,
  isSingleClickOption = false,
  disabled = false,
  children,
  optionComponent,
  menuIsOpen,
  customStyle,
  tooltipMessage,
  tooltipProps,
  showOptionIcon,
  dropdownPosition,
  onSetAsFavourite,
  defaultOpen,
  isMultiRegionStyled = false,
  handleClick = () => { },
}: ISelectProps) => {


  const [selectedOption, setSelectedOption] = useState<OnChangeValue<
        OptionType, boolean
    > | null>(
      optionList.find(
        ({ value: optionValue }: { value: string }) => optionValue === value,
      ) || null,
    )

  const [isMenuOpen, setIsMenuOpen] = useState(menuIsOpen)

  /* In the case of Date picker , I externally pass selected value which will be string. 
      As react-select wants {label, value} format.
      Selection is done below */

  useEffect(() => {
    setIsMenuOpen(menuIsOpen)
  }, [menuIsOpen])
  useEffect(() => {
    const optionSelected = optionList.find(
      ({ value: optionValue }: { value: string }) => optionValue === value,
    )
    setSelectedOption(optionSelected)
  }, [value])

  const theme = useContext(ThemeContext)
  const defaultProps = {
    id,
    primary,
    intent,
    iconButtonDetails,
    options: optionList,
    value: selectedOption,
    variant,
    width,
    theme,
    placeholder,
    showDownArrow,
    children,
    customStyle,
    menuIsOpen: isMenuOpen,
    onChange: (input: OnChangeValue<OptionType, boolean>) => handleDeviceChange(input),
    optionComponent,
    tooltipMessage,
    disabled,
    tooltipProps,
    showOptionIcon,
    dropdownPosition,
    handleClick,
    defaultOpen,
    isMultiRegionStyled,
  }

  const selectComponent: { [key: string]: React.ReactNode } = {
    // 'button-dropdown': <ButtonDropdown defaultProps={defaultProps} />,
    // 'multilevel-button-dropdown': (
    //     <MultiLevelButtonDropdown defaultProps={defaultProps} />
    // ),
    // 'pagination-size': <PaginationDropdown defaultProps={defaultProps} />,
    // 'column-filter': <ColumnOptionFilter defaultProps={defaultProps} />,
    'bread-crumb': (
      <BreadCrumb
        defaultProps={defaultProps}
        handleOutsideChange={onChange}
        onSetAsFavourite={onSetAsFavourite}
      />
    ),
    // 'date-picker': <DatepickerDropdown defaultProps={defaultProps} />,
    'default-dropdown': <DropdownUniversal defaultProps={defaultProps} />,
    // 'text-dropdown': <TextDropdown defaultProps={defaultProps} />,
    // 'multilevel-breadcrumb':
    //     <MultiLevelBreadCrumb
    //         defaultProps={defaultProps}
    //         handleOutsideChange={onChange}
    //     />
  }

  const handleDeviceChange = (input: OnChangeValue<OptionType, boolean>) => {
    const option = input as OptionType
    const previousOption = selectedOption as OptionType
    if (option?.value !== previousOption?.value) {
      setSelectedOption(input)
      option ? onChange(option?.value as string) : onChange(undefined)
    } else if (isSingleClickOption) {
      option && onChange(option?.value)
    }
  }

  return (
    <IconDropdownDropdownStyled>
      {selectComponent[variant] || 'No varaint'}
    </IconDropdownDropdownStyled>
  )
}

export default IconDropdown