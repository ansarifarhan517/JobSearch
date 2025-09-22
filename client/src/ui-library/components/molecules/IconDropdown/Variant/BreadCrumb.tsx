import React from 'react'
import Select, { components } from 'react-select'
import { DownArrowIndicator } from '../../Dropdown/CustomComponent'
import { IIconDropdown, OptionType } from '../../Dropdown/interface'
import { StyledSelectWrapper } from '../StyledIconDropdown'
import BreadCrumbStyled  from '../Styles/BreadCrumb.Styled'
import { Option } from '../subComponents/Option'

const BreadCrumb = ({
  defaultProps,
  handleOutsideChange,
  onSetAsFavourite,
}: {
  defaultProps: IIconDropdown
  handleOutsideChange: (value: string) => void
  onSetAsFavourite?: (option: OptionType) => void
}) => {
  const {
    options,
    value,
    primary,
    intent,
    iconButtonDetails,
    variant,
    width = '160px',
    theme,
    menuIsOpen,
    onChange,
  } = defaultProps

  const handleOnChange = (input: OptionType, isSetFavouriteClick?: boolean) => {
    const option = value as OptionType
    if (input?.value === option?.value && handleOutsideChange) {
      handleOutsideChange(option.value)
    } else {
      onChange && onChange(input)
    }

    if (isSetFavouriteClick) {
      onSetAsFavourite && onSetAsFavourite(input)
    }
  }

  return (
    <StyledSelectWrapper
      width="0px"
      onClick={(e: any) => {
        e.stopPropagation()
      }}
    >
      <Select
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: DownArrowIndicator,
          LoadingIndicator: () => null,
          Option: (props: any) => (
            <Option
              {...props}
              onSetAsFavourite={(input: OptionType) =>
                handleOnChange(input, true)
              }
              isSetFavourite={onSetAsFavourite}
              isFavourite={props?.data?.isFavourite}
              onOptionClick={handleOnChange}
            />
          ),
          Menu: (props) => (
            <components.Menu {...props} className="menuAnimate" />
          ),
        }}
        styles={BreadCrumbStyled(width, theme)}
        options={options}
        value={value}
        width="0px"
        primary={primary}
        intent={intent}
        iconButtonDetails={iconButtonDetails}
        theme={theme}
        variant={variant}
        menuIsOpen={menuIsOpen}
        placeholder=""
      />
    </StyledSelectWrapper>
  )
}

export default React.memo(BreadCrumb)
