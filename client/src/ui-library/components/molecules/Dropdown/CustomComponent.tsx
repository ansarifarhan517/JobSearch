import React from 'react'
import { ReactComponent as Loader } from '../../../../../assets/images/loader.svg'
import { components } from 'react-select'
import { ControlStyle, DescriptiveOption, StyledDisabledlabel } from './StyledDropDown'
import { OptionType } from './interface'
import FontIcon from '@ui-library/components/atoms/FontIcon'
import { faCaretDown, faXmark } from '@fortawesome/free-solid-svg-icons'



// down arrow shown on form select fields

export const DropdownIndicator = ({ showDropdownIndicator, selectProps, ...rest }: any) =>
  React.useMemo(() => {
    const {
      variant,
      value,
    }: { variant: string; menuIsOpen: boolean, value: OptionType } = selectProps
    // theme object going inside of select component
    const color = variant === 'list-view' ? 'grey.800' : 'black'
    return (
      <components.DropdownIndicator {...rest}>
        {!value && showDropdownIndicator !== false ? (
          <FontIcon size={'xs'} icon={faCaretDown} color={color} />
        ) : (
          <div />
        )}
      </components.DropdownIndicator>
    )
  }, [selectProps.variant, selectProps.value])

// for bradcrumb down arrow being shown

export const DownArrowIndicator = (props: any) => {
  const color = 'grey[A800]'

  return (
    <components.DropdownIndicator {...props}>
      {props?.selectProps?.variant === 'bread-crumb' ? (
        <div></div>
      ) : (
        <FontIcon
          size={'xs'}
          color={color}
          icon={faCaretDown}
          hoverColor={color}
        />
      )}
    </components.DropdownIndicator>
  )
}
// loader being shown when values yet to load or searching value from the list
export const LoadingIndicator = (props: any) =>
  React.useMemo(() => (

    <components.DropdownIndicator {...props}>
      <Loader />
    </components.DropdownIndicator>
  ), [])

// input is shown here
export const Control = ({ children, ...rest }: any) =>
  React.useMemo(() => (
    // eslint-disable-next-line
    <ControlStyle {...rest} cx='default-contorl'>
      <components.Control {...rest}>{children}</components.Control>
    </ControlStyle>
  ), [children])

export const SingleValue = ({ showCrossIcon, children, ...rest }: any) =>
  React.useMemo(() => {
    const color = 'white'
    const style = {
      padding: '0.5px 1.5px',
      margin: '0 7px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#5698d3',
      cursor: 'pointer',
      position: 'absolute',
      right: '1px',
    }

    return (
      <components.SingleValue {...rest}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '100%',
          justifyContent: 'space-between',
        }}>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}> {children}</span>
          {showCrossIcon !== false ?
            <div
              style={style}
              onMouseDown={(e: any) => e.stopPropagation()}
              onClick={() => rest.setValue(null)}
            >
              <FontIcon icon={faXmark} size={'sm'} color={color} />
            </div> : <div />
          }
        </div>
      </components.SingleValue>
    )
  }, [children])

export const Option = (props: any) => {
  delete props.innerProps.onMouseMove
  delete props.innerProps.onMouseOver
  const optionComponent = props.selectProps.optionComponent
  const selectedOption = props?.options?.filter(
    (option: any) => option.value === props.value,
  )
  return (
    <>
      {props.isDisabled ? (
        <div title={props.data?.title || undefined}>
          <components.Option
            {...props}
          >
            <StyledDisabledlabel><div
              data-tip={props.data?.tooltipText}
              data-for={`tt-${props.data?.value}`}
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {props.showOptionIcon && <span style={{ marginRight: 5 }}>
                <FontIcon icon={props.data.iconVariant} size={'sm'} color={''} />
              </span>}
              {optionComponent
                ? optionComponent({ selectedOption: selectedOption[0] })
                : props.children}
            </div>

            <DescriptiveOption className="option_description"> {props.showDescription && props?.data?.description}</DescriptiveOption>
            </StyledDisabledlabel>
            {/* {props.data?.tooltipText && (
              <ReactTooltip
                id={`tt-${props.data.value}`}
                type="info"
                effect="solid"
                place="bottom"
              />
            )} */}
          </components.Option>
        </div>) :
        (<div title={props.data?.title || undefined}>
          <components.Option
            {...props}
          >
            <div
              data-tip={props.data?.tooltipText}
              data-for={`tt-${props.data?.value}`}
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {props.showOptionIcon && <span style={{ marginRight: 5 }}>
                <FontIcon icon={props.data.iconVariant} size={'sm'} color={''} />
              </span>}
              {optionComponent
                ? optionComponent({ selectedOption: selectedOption[0] })
                : props.children}
            </div>

            <DescriptiveOption className="option_description"> {props.showDescription && props?.data?.description}</DescriptiveOption>
            {/* {props.data?.tooltipText && (
              <ReactTooltip
                id={`tt-${props.data.value}`}
                type="info"
                effect="solid"
                place="bottom"
              />
            )} */}
          </components.Option>

        </div>)

      }
    </>
  )
}
