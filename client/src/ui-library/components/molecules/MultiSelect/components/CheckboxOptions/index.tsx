import React from 'react'
import makeAnimated from 'react-select/animated'
import { components } from 'react-select'
import Checkbox from '../../../../atoms/Checkbox'
import { IMultiSelectOptions } from '../../interfaces'

import {
  StyledCheckBoxlabel,
  OptionCheckboxStyled
} from '../../MultiSelect.styled'

const shouldBeDisabled = (
  optionSelected: IMultiSelectOptions[],
  maximumSelected: number,
  value: string
) =>
  optionSelected.length >= maximumSelected &&
  !optionSelected.find((a: IMultiSelectOptions) => a.value === value)

export const Option = (props: any) => {
  return (
    <OptionCheckboxStyled>
      <components.Option {...props}>
        <Checkbox
          id={'id-' + props.value}
          disabled={React.useMemo(
            () =>
              shouldBeDisabled(
                props.optionSelected,
                props.maximumSelected,
                props.value
              ),
            [props.optionSelected, props.maximumSelected, props.value]
          )}
          type='checkbox'
          checked={props.isSelected}
          onChange={() => null}
          checkboxSize='md'
        />{' '}
        <StyledCheckBoxlabel title={props.label}>
          {props.label}
        </StyledCheckBoxlabel>
      </components.Option>
    </OptionCheckboxStyled>
  )
}

export const AnimatedComponents = makeAnimated()
