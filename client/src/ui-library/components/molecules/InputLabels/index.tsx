import React from 'react'
import styled from 'styled-components'
import Typography, { ITypographyProps } from '../../atoms/Typography'

// Utility to filter out props that shouldn't be forwarded to the DOM element
const shouldForwardProp = (prop: string) => !['required', 'isChildNode'].includes(prop)

export interface IInputLabelProps extends ITypographyProps {
    required?: boolean
    isChildNode?: boolean
}

// Create a styled version of Typography that uses shouldForwardProp
const StyledTypography = styled(Typography).withConfig({ shouldForwardProp })`
  font-size: 12px;
  color: grey.800;
  background-color: white;
  font-family: Gotham-Rounded, Sans-Serif;
`

const InputLabel = ({ children, required, ...rest }: IInputLabelProps) => (
  <StyledTypography {...rest}>
    {children} {required && !rest.isChildNode && '*'}
  </StyledTypography>
)

export { InputLabel as default }
