import styled, { css } from 'styled-components'
import { IRadioGroupProps } from '.'
import Box from '../Box'

export const RadioGroupStyled = styled(Box)<IRadioGroupProps>`
  display: ${({ orientation }) =>
    orientation ? 'inline-block' : 'inline-flex'};
  justify-content: space-between;
  ${({ variant, error }) =>
    variant === 'form' &&
    css`
      border: 1px solid
        ${({ theme }) =>
          error ? theme?.colors?.error?.main : theme?.colors?.grey['A800']};
    `}
  position: relative;
  width: ${({ width }) => width};
  min-height: 40px;
  padding: 0px 0.5em;
  box-sizing: border-box;
  margin: 18px 0;
`
