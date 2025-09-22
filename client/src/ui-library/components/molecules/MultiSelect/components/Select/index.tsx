import React from 'react'
import ReactSelect from 'react-select/async'
import { IMultiSelectOptions, ISelectProps } from '../../interfaces'

const CustomSelect = ({
  options,
  loadOptions,
  value,
  onChange = () => {},
  allOption = {
    label: 'Select all',
    value: '*'
  },
  allowSelectAll,
  ...rest
}: ISelectProps) => {
  if (allowSelectAll) {
    return (
      <ReactSelect
        {...rest}
        value={value}
        maxMenuHeight={200}
        loadOptions={loadOptions}
        defaultOptions={options ? [allOption, ...options] : undefined}
        onChange={(selected: any, event: any) => {
          if (selected !== null && selected.length > 0) {
            if (selected[selected.length - 1].value === allOption.value) {
              return onChange(
                event?.option?.value,
                event?.action === 'select-option',
                options ? [allOption, ...options] : [],
                event
              )
            }
            let result: IMultiSelectOptions[] = []

            if (selected.length === options?.length) {
              if (selected[0].value === allOption.value) {
                result = selected?.length>0 ? selected?.filter(
                  (option: any) => option.value !== allOption.value
                  ):[]
              } else if (event.action === 'select-option') {
                result = options ? [...options] : []
              } else {
              }

              return onChange(
                event?.option?.value,
                event?.action === 'select-option',
                result,
                event
              )
            }
          }

          return onChange(
            event?.option?.value,
            event?.action === 'select-option',
            selected,
            event
          )
        }}
        menuPlacement='auto'
      />
    )
  }
  return (
    <ReactSelect
      {...rest}
      value={value}
      loadOptions={loadOptions}
      defaultOptions={options ? [...options] : undefined}
      maxMenuHeight={200}
      menuPlacement='auto'
      onChange={(selected: any, event: any) => {
        onChange(
          event?.option?.value,
          event?.action === 'select-option',
          selected,
          event
        )
      }}
    />
  )
}

export default CustomSelect
