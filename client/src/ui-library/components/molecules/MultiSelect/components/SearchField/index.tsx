import React from 'react'
import { components } from 'react-select'
import FontIcon from '../../../../atoms/FontIcon'
import { InputStyled } from '../../MultiSelect.styled'

import { IMultiSelectOptions } from '../../interfaces'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const allOption = {
  label: 'Select all',
  value: '*'
}

export const ValueContainer = ({ children, getValue, ...props }: any) => {
  const currentValues = getValue()
  const toBeRendered = currentValues.some(
    ({ value }: IMultiSelectOptions) => value === allOption.value
  )
    ? [[children[0][0]], children[1]]
    : children

  return (
    <components.ValueContainer {...props}>
      <FontIcon icon={faSearch} color='grey.A800' size='sm' />
      {toBeRendered}
    </components.ValueContainer>
  )
}

export const Input = (props: any) => {
  return (
    <InputStyled className="multiselect-search-input-wrappper">
      <components.Input {...props} className='multiselect-serach-input' />
    </InputStyled>
  )
}

export const MultiValue = (props: any) => {
  const labelToBeDisplayed =
    props.data.value === allOption.value
      ? 'All is selected'
      : `${props.data.label}, `

  return (
    <components.MultiValue {...props}>
      <span>{labelToBeDisplayed}</span>
    </components.MultiValue>
  )
}

// export const NoOptionsMessage = ({ props }: any) => {
//   console.log(props)
//   return (
//     <div>
//       <components.NoOptionsMessage {...props}>
//         Loading ...
//       </components.NoOptionsMessage>
//     </div>
//   )
// }
