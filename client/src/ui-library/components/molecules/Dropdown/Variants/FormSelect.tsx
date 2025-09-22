import React, { useMemo } from 'react'
import { IFormSelect } from '../interface'
import styled from 'styled-components'
import Position from '@ui-library/components/atoms/Position'
import Tooltip from '../../Tooltip'
import InputLabel from '../../InputLabels'
import Select, { components, InputActionMeta } from 'react-select'
import { DropdownIndicator, LoadingIndicator, Option, SingleValue } from '../CustomComponent'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import FontIcon from '@ui-library/components/atoms/FontIcon'
import ErrorTooltip from '../../ErrorTooltip'
import { FormSelectStyled } from '../Styles'




const FormSelectWrapper = styled.div`
  background-color: white;
  .react-select__option.react-select__option--is-selected {
    background-color: ${({ theme }) => theme?.colors?.primary?.main};
  }
`

const FontIconStyled = styled.div`
  background-color: ${({ theme }) => theme?.colors?.primary.main};
  color: ${({ theme }) => theme?.colors?.primary.contrastText};
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  box-sizing: border-box;
`
const SelectContainerStyled = styled.div`
  width: 100%;
`

const FormSelect: React.FC<IFormSelect> = ({
  error,
  errorMessage,
  label,
  required,
  defaultProps,
  showDescription,
  showDropdownIndicator,
  showNoDataText,
  showCrossIcon,
  isSortable = true,
}) => {

  const {
    options,
    value,
    isLoading,
    placeholder = '',
    onInputChange,
    onChange,
    onFocus,
    isSearchable,
    onMenuOpen,
    onMenuClose,
    isMenuOpen,
    tooltipMessage,
    disabled,
    labelColor,
    limitOptionsList,
    arrowPlacement,
    messagePlacement,
    tooltipDirection,
    align,
    withIcon,
    iconVariant,
    iconSize,
    iconStyle,
    onIconClick,
    fullWidth,
  } = defaultProps

  const resultLimit = limitOptionsList || 25

  let i = 0
  const [input, setInput] = React.useState<any>()
  const optionsMemo = useMemo(() => {

    const alphaNumericSort = (opti: any) => {
      const sorter = (currentLabel: any, newLabel: any) => {
        const isNumber = (v: any) => (+v).toString() === v
        const currentLabelPart = currentLabel.label.match(/\d+|\D+/g)
        const newLabelPart = newLabel.label.match(/\d+|\D+/g)
        let i = 0
        const len = Math.min(currentLabelPart.length, newLabelPart.length)
        while (i < len && currentLabelPart[i] === newLabelPart[i]) { i++ };
        if (i === len) {
          return currentLabelPart.length - newLabelPart.length
        };
        if (isNumber(currentLabelPart[i]) && isNumber(newLabelPart[i])) {
          return currentLabelPart[i] - newLabelPart[i]
        };
        return currentLabelPart[i].localeCompare(newLabelPart[i])
      }
      opti.sort(sorter)
    }
    isSortable && alphaNumericSort(options)
    const newdropdownoptions = options?.filter((dropdownOption: { label: string }) => {
      if (input) {
        return (
          dropdownOption?.label
            ?.toLowerCase()
            .indexOf(input?.toString()?.toLowerCase()) >= 0 && i++ < resultLimit
        )
      } else {
        return i++ < resultLimit
      }
    })

    const sortByLabel = (a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label, undefined, { numeric: true })
    const newlist = isSortable ? newdropdownoptions.sort(sortByLabel) : newdropdownoptions
    return newlist
  }, [input, options])


  const onInputChangeWrapper = (
    newValue: string,
    actionMeta: InputActionMeta,
  ) => {
    setInput(newValue)
    onInputChange && onInputChange(newValue, actionMeta)
  }

  return (
    <FormSelectWrapper>
      <Position
        type="relative"
        display={withIcon ? 'flex' : 'block'}
        alignItems="stretch"
        fullWidth={fullWidth}
      >
        {label && (
          <Position
            type="absolute"
            top={withIcon ? '10px' : '-7px'}
            left="10px"
            zIndex="100"
            style={{ maxWidth: 'calc(100% - 20px)' }}
          >
            <Tooltip
              message={tooltipMessage}
              hover
              hide={!tooltipMessage || isMenuOpen}
              arrowPlacement={arrowPlacement || 'center'}
              messagePlacement={messagePlacement || 'center'}
              tooltipDirection={tooltipDirection || 'bottom'}
              align={align || 'center'}
              isWordWrap
            >
              <InputLabel
                children={label}
                color={labelColor}
                required={required}
              />
            </Tooltip>
          </Position>
        )}
        <SelectContainerStyled>
          <Select
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: (props) => (
                <DropdownIndicator
                  showDropdownIndicator={showDropdownIndicator}
                  {...props}
                />
              ),
              LoadingIndicator,
              ClearIndicator: () => showCrossIcon === false ? null : <div />,
              SingleValue: (props) => (
                <SingleValue showCrossIcon={showCrossIcon} {...props} />
              ),
              Option: (props) => (
                <Option showDescription={showDescription} {...props} />
              ),
              Menu: (props) => (
                <components.Menu {...props} className="menuAnimate" />
              ),
            }}
            styles={FormSelectStyled(error)}
            noOptionsMessage={() =>
              showNoDataText ? 'No Data Available' : null
            }
            options={optionsMemo}
            value={value}
            isLoading={isLoading}
            placeholder={placeholder}
            onInputChange={onInputChangeWrapper}
            isClearable={showCrossIcon === false}
            onChange={(input: any) => {
              i = 0
              const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
              obj?.forEach((e) => {
                e.remove()
              })
              onChange && onChange(input)
            }}
            onFocus={onFocus}
            isSearchable={isSearchable}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
            menuIsOpen={isMenuOpen}
            menuPlacement="auto"
            closeMenuOnSelect
            maxMenuHeight={200}
            isDisabled={disabled}
            // openMenuOnClick
          />
        </SelectContainerStyled>

        {/*  For Icon */}
        {withIcon && (
          <div style={{ minHeight: '40PX' }}>
            <FontIconStyled
              style={{
                ...(label
                  ? {
                    margin: '18px 0px 0',
                    minHeight: '40px',
                    height: 'auto',
                  }
                  : { margin: '0px',
                    minHeight: '40px',
                    height: 'auto' }),
                ...iconStyle,
              }}
              onClick={onIconClick}
            >
              <FontIcon
                icon={iconVariant || faCalendar}
                color="white"
                size={iconSize}
              />
            </FontIconStyled>
          </div>
        )}

        {error && errorMessage && (
          <Position type="absolute" top="-7.5px" right="-6.5px">
            <ErrorTooltip message={errorMessage} isWordWrap/>
          </Position>
        )}
      </Position>
    </FormSelectWrapper>
  )
}

export default FormSelect