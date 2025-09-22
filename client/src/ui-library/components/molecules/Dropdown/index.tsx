import React, { useCallback, useEffect, useState } from 'react'
import { IDefaultProps, ISelectProps, OptionType } from './interface'
import { StyledDropDown } from './StyledDropDown'
import DefaultSelect from './Variants/DefaultSelect'
import { OnChangeValue, SingleValue } from 'react-select'
import FormSelect from './Variants/FormSelect'

export interface ISelectComponentInterface {
  [key: string]: React.ReactNode;
}

const DropDown: React.FC<ISelectProps> = ({
  variant = 'form-select',
  optionList = [],
  required = false,
  label = '',
  error = false,
  errorMessage = '',
  placeholder = '',
  loading = false,
  isMenuOpen,
  onChange = () => { },
  onInputChange = () => { },
  value,
  width = '100%',
  onMenuOpen = () => { },
  onMenuClose = () => { },
  showDescription = false,
  tooltipMessage,
  disabled = false,
  labelColor,
  showDropdownIndicator = true,
  showNoDataText = true,
  showCrossIcon = true,
  limitOptionsList,
  align,
  withIcon = false,
  iconVariant,
  iconSize,
  iconStyle,
  iconBorder = true,
  onIconClick,
  isSortable = true,
}) => {
  const [selectedOption, setSelectedOption] = useState<SingleValue<
    OptionType
  > | null>(null)

  const [isLoading, setIsLoading] = useState(loading)
  const [isCrossVisible, setIsCrossVisible] = useState(false)
  const [_optionList, setOptionList] = useState(optionList)

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  useEffect(() => {
    const optionSelected = optionList.find(
      ({ value: optionValue }: { value: string }) => optionValue === value,
    )
    // setIsCrossVisible(!!value)
    setIsCrossVisible(!!value && !!optionSelected)
    setSelectedOption(optionSelected || null)
    setOptionList(optionList)
  }, [value, optionList])

  const defaultProps: IDefaultProps = {
    options: _optionList,
    value: selectedOption,
    isLoading,
    placeholder,
    // onInputChange: () => handleInputChange(),
    onInputChange,
    onChange: (input: OnChangeValue<OptionType, boolean>) => handleDeviceChange(input),
    onFocus: () => {
      // setIsLoading(false)
    },
    isSearchable: true,
    isMenuOpen,
    variant,
    onMenuOpen,
    onMenuClose,
    tooltipMessage,
    disabled,
    labelColor,
    limitOptionsList,
    align,
    iconBorder,
    withIcon,
    iconVariant,
    iconSize,
    iconStyle,
    onIconClick,
  }

  const handleDeviceChange = useCallback(
    (input: OnChangeValue<OptionType, boolean>) => {
      const option = input as OptionType
      const previousOption = selectedOption as OptionType
      if (option?.value !== previousOption?.value) {
        // setIsLoading(false)
        setSelectedOption(input as SingleValue<OptionType>)
        setIsCrossVisible(true)
        option ? onChange(option?.value) : onChange('')
      }
    },
    [selectedOption, onChange],
  )

  const selectComponent: ISelectComponentInterface = {
    'form-select': (
      <FormSelect
        defaultProps={defaultProps}
        error={error}
        errorMessage={errorMessage}
        label={label}
        required={required}
        showDescription={showDescription}
        showDropdownIndicator={showDropdownIndicator}
        showNoDataText={showNoDataText}
        showCrossIcon={showCrossIcon}
        isSortable={isSortable}
      />
    ),
    'default-select': <DefaultSelect defaultValue={defaultProps} />,
    // 'list-view': (
    //   <ListView
    //     defaultProps={defaultProps}
    //     setIsCrossVisible={setIsCrossVisible}
    //     isCrossVisible={isCrossVisible}
    //     handleCloseChange={handleCloseChange}
    //   />
    // ),
    // 'inline-edit': <InlineEditDropdown defaultProps={defaultProps} />,
    // 'dashed-dropdown': <InlineDashedDropdown defaultProps={defaultProps} />
  }
  return (
    <StyledDropDown width={width}>
      {selectComponent[variant] || 'No varaint'}{' '}
    </StyledDropDown>
  )

}

export default DropDown