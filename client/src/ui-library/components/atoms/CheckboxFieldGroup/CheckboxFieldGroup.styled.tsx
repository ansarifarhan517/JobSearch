import styled, { css } from 'styled-components'
import type { ICheckboxFieldGroupProps } from '.'
import { spacingMixin } from '../../../utilities/components/mixins'

// Utility to filter out props that shouldn't be forwarded to the DOM element
const shouldForwardProp = (prop: string) =>
    !['orientation', 'variant', 'error', 'horizontalSpacing', 'verticalSpacing'].includes(prop)

export const CheckboxFieldGroupStyled = styled.div.withConfig({ shouldForwardProp }) <ICheckboxFieldGroupProps>`
  display: ${({ orientation }) =>
        orientation ? 'inline-block' : 'inline-flex'};
  justify-content: flex-start;
  align-items: center;
  ${({ variant, error }) =>
        variant === 'form' &&
        css`
      border: 1px solid
        ${({ theme }) =>
                error ? theme?.colors?.error?.main : theme?.colors?.grey?.A800};
      justify-content: space-between;
    `}
  position: relative;
  width: ${({ width }) => width};
  min-height: 40px;
  padding: 0px 0.5em;
  box-sizing: border-box;
  margin: 18px 0;
  ${spacingMixin};
`
