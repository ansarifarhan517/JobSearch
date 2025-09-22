import React from 'react'
import AsyncSelect from 'react-select/async'
import { Options, Props } from 'react-select'
import { AsyncFormSelectStyled } from './Styles'
import {
  LoadingIndicator,
  SingleValue,
  DropdownIndicator,
  Option,
} from './CustomComponent'
import Position from '../../atoms/Position'
import ErrorTooltip from '../ErrorTooltip'
import InputLabel from '../InputLabels'

export type tOptionType = {
    label: string
    value: any
}

export interface IAsyncFormSelectProps extends Props<tOptionType> {
    label?: string
    required?: boolean
    error?: boolean
    errorMessage?: string
    disabled?: boolean
    /** Temporary Typescript fix. As it is not picking up from library */
    loadOptions: (
        inputValue: string,
        callback: (options: Options<tOptionType>) => void
    ) => Promise<any> | void
    placeholder?: string
    onChange?: (option: any) => void
    value?: tOptionType | null | undefined
    cacheOptions?: boolean
    showDescription?: boolean
    showCrossIcon?: boolean
}

const AsyncFormSelect = ({
  label = '',
  required = false,
  error = false,
  errorMessage = '',
  disabled = false,
  showDescription = false,
  showCrossIcon = true,
  ...props
}: IAsyncFormSelectProps) => (
  <Position type="relative">
    {label && (
      <Position
        type="absolute"
        top="-7px"
        left="10px"
        zIndex="100"
        style={{ maxWidth: 'calc(100% - 20px)' }}
      >
        <InputLabel children={label} required={required} />
      </Position>
    )}
    <AsyncSelect
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator,
        LoadingIndicator,
        ClearIndicator: () => showCrossIcon === false ? null : <div />,
        SingleValue: (props) => <SingleValue showCrossIcon={showCrossIcon} {...props} />,
        Option: (props) => (
          <Option showDescription={showDescription} {...props} />
        ),
      }}
      menuPlacement="auto"
      isClearable={showCrossIcon === false ? true : false}
      maxMenuHeight={200}
      styles={AsyncFormSelectStyled(error)}
      isDisabled={disabled}
      {...props}
    />
    {error && errorMessage && (
      <Position type="absolute" top="-9.5px" right="-6.5px">
        <ErrorTooltip message={errorMessage} isWordWrap/>
      </Position>
    )}
  </Position>
)

export default AsyncFormSelect
