import React from 'react'
import makeAnimated from 'react-select/animated'
import { components } from 'react-select'
import {
  OptionCheckboxStyled,
  StyledCheckBoxlabel,
} from '../../MultiSelect/MultiSelect.styled'
import FontIcon from '../../../atoms/FontIcon'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'

export const Option = (props: any) => (
  <OptionCheckboxStyled onClick={() => props.onOptionClick(props.data)}>
    <components.Option {...props}>
      {props?.isSetFavourite && (
        <span
          onClick={(e) => {
            props?.onSetAsFavourite(props?.data)
            e.stopPropagation()
          }}
        >
          <FontIcon
            icon={props.isFavourite ? faStar : faStarEmpty}
            color={props.isFavourite ? 'primary.main' : ''}
            size={'sm'}
          />
        </span>
      )}{' '}
      <StyledCheckBoxlabel
        title={props.label}
      >
        {props.label}
      </StyledCheckBoxlabel>
    </components.Option>
  </OptionCheckboxStyled>
)

export const AnimatedComponents = makeAnimated()
