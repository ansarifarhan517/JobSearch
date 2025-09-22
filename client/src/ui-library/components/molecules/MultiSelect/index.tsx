import React, { useState, useEffect, useRef } from 'react'
import Select from './components/Select'

import { Option, AnimatedComponents } from './components/CheckboxOptions'
import {
  ValueContainer,
  MultiValue,
  Input
  // NoOptionsMessage
} from './components/SearchField'

import { MultiSelectStyled, CustomStyles } from './MultiSelect.styled'

import { IMultiSelectProps, IMultiSelectOptions } from './interfaces'

const emptyArray: IMultiSelectOptions[] = []

const removeExtra = (maximumSelected: number, selected: any[]) => {
  if (!maximumSelected || selected.length <= maximumSelected) {
    return selected || []
  } else {
    return selected.slice(-selected.length, maximumSelected) || []
  }
}

const defaultCallback = () => {}
const MultiSelect = ({
  options,
  onChange = () => {},
  width,
  children,
  isLoading = false,
  isNoOption = false,
  menuOpen = false,
  defaultSelected = emptyArray,
  selected = emptyArray,
  allowSelectAll,
  maximumSelected,
  searchableKeys = ['label'],
  onMenuOpen = defaultCallback,
  onMenuClose = defaultCallback,
  resultLimit = 50,
  onInputChange,
  onOutsideClick,
  ...rest
}: IMultiSelectProps) => {
  const node = useRef(null)
  const [isMenuOpen, openMenu] = useState(menuOpen)
  const [inputValue, setInputValue] = React.useState<string>()
  const menuOpenRef = React.useRef<boolean>(menuOpen)

  let count: number = 0

  useEffect(() => {
    menuOpenRef.current = isMenuOpen
  }, [isMenuOpen])

  const handleOutsideClick = (e: any) => {
    const n = (node.current as unknown) as Node
    if (n.contains(e.target)) return
    if (menuOpenRef.current) {
      onMenuClose()
      setInputValue('')
      onOutsideClick && onOutsideClick()
    }
    openMenu(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const [optionSelected, setOptionSelected] = useState<IMultiSelectOptions[]>(
    defaultSelected.length ? defaultSelected : selected
  )

  useEffect(() => {
    setOptionSelected(
      maximumSelected ? removeExtra(maximumSelected, selected) : selected
    )
  }, [selected])

  const fiterOptions = () => {
    count = 0
    const selectedOptionsMap = {}
    const selectedOptions =
      selected?.length > 0
        ? selected?.filter((i) => {
            return searchableKeys.some((c) => {
              if (
                i &&
                i[c]?.toLowerCase()?.includes((inputValue || '')?.toLowerCase())
              ) {
                selectedOptionsMap[i?.value] = i
              }
              return (
                i &&
                i[c]?.toLowerCase()?.includes((inputValue || '')?.toLowerCase())
              )
            })
          })
        : []
    const filterOptions = options?.filter((i) => {
      return (
        !selectedOptionsMap[i?.value] &&
        searchableKeys.some((c) => {
          return (
            i[c]?.toLowerCase()?.includes((inputValue || '')?.toLowerCase()) &&
            count++ < resultLimit - selectedOptions?.length
          )
        })
      )
    })
    return [...selectedOptions, ...[...(filterOptions || [])]]
  }

  const optionsMemo = React.useMemo(() => {
    return fiterOptions()
  }, [fiterOptions, options])

  return (
    <div ref={node} style={{ width: '100%', cursor: 'pointer' }}>
      {children({ optionSelected, isMenuOpen, openMenu })}

      {isMenuOpen && (
        <MultiSelectStyled
          className='d-inline-block'
          data-toggle='popover'
          data-trigger='focus'
          data-content='Search'
          width={width}
          {...rest}
        >
          <Select
            loadOptions={(_, callback) => {
              callback(fiterOptions())
            }}
            options={isLoading || isNoOption ? undefined : optionsMemo}
            value={optionSelected}
            components={{
              Option: (props: any) => (
                <Option
                  {...props}
                  optionSelected={optionSelected}
                  maximumSelected={maximumSelected}
                />
              ),
              MultiValue,
              ValueContainer,
              AnimatedComponents,
              Input,
              IndicatorSeparator: () => null,
              DropdownIndicator: () => null,
              ClearIndicator: () => null
            }}
            onChange={(
              value: string,
              isSelected: boolean,
              selectedOption: IMultiSelectOptions[],
              event: any
            ) => {
              count = 0
              if (event?.action !== 'pop-value') {
                if (
                  !isSelected ||
                  !maximumSelected ||
                  !optionSelected ||
                  optionSelected?.length < maximumSelected
                ) {
                  // if selected all, then removing the { select-all, *} from array and exposing the array
                  let selectedArray: any = [...selectedOption]
                  const SelectAllObject = selectedArray[0]
                  selectedArray =
                    selectedArray[0]?.value === '*'
                      ? selectedArray.slice(1)
                      : selectedArray

                  /** * if maxiumum selected applied and select all, that logic is applied here .**/
                  let newSelectedOption =
                    maximumSelected && selectedArray.length > maximumSelected
                      ? removeExtra(maximumSelected, selectedArray)
                      : selectedArray
                  if (value === '*') {
                    if (isSelected) {
                      newSelectedOption.push(SelectAllObject)
                    } else {
                      newSelectedOption = []
                    }
                  } else {
                    if (!isSelected) {
                      const index = newSelectedOption
                        .map((v: any) => v.value)
                        .indexOf(value)
                      index !== -1 && newSelectedOption.splice(index, 1)
                    }
                  }
                  // logic for selectall and maximum selected ends

                  setOptionSelected(newSelectedOption)

                  onChange(event, value, isSelected, newSelectedOption)
                } else {
                  onChange(event, 'maximum exceeded', false, optionSelected)
                }
              }
            }}
            inputValue={inputValue}
            onInputChange={(query, { action }) => {
              // Prevents resetting our input after option has been selected
              if (action === 'input-change') {
                setInputValue(query)
              }
              onInputChange && onInputChange(query)
            }}
            allowSelectAll={allowSelectAll}
            menuIsOpen
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            isMulti
            styles={CustomStyles()}
            closeMenuOnScroll
            noOptionsMessage={() =>
              isLoading ? 'Loading...' : 'No Data Available'
            }
            onMenuClose={onMenuClose}
            onMenuOpen={onMenuOpen}
          />
        </MultiSelectStyled>
      )}
    </div>
  )
}

export default MultiSelect
