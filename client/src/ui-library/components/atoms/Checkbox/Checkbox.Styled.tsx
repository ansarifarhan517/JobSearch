import styled, { css } from 'styled-components'
import type { ICheckboxProps } from '.'
import { colorMixin } from '../../../utilities/components/mixins'

export const CheckboxContainer = styled.span`
  display: inline-block;
  vertical-align: middle;
`

export const Icon = styled.svg`
  fill: none;
  stroke: ${({ theme }) => theme?.colors?.primary.contrastText};
  stroke-width: 2px;
  display: flex;
  vertical-align: middle;
`

// Utility to filter out props that shouldn't be forwarded to the DOM element
const shouldForwardProp = (prop: string) =>
  !['checkboxSize', 'HiddenCheckbox', 'disabledVariant'].includes(prop)

export const HiddenCheckbox = styled.input.withConfig({ shouldForwardProp }) <ICheckboxProps>`
  border: 0;
  clippath: inset(50%);
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  cursor: pointer;
  opacity: 0;
  width: ${({ checkboxSize }) => `${checkboxSize}px`};
  height: ${({ checkboxSize }) => `${checkboxSize}px`};
  margin: 0;
`


export const StyledCheckbox = styled.span.withConfig({ shouldForwardProp }) <ICheckboxProps>`
  display: inline-block;
  position: relative;
  width: ${({ checkboxSize }) => `${checkboxSize}px`};
  height: ${({ checkboxSize }) => `${checkboxSize}px`};
  border: ${({ theme, color }) =>
    `1px solid ${color || theme?.colors?.grey?.inputBorder}`};
  ${({ checked, color }) =>
    checked &&
    css`
      background-color: ${({ theme }) =>
        checked
          ? `${color || theme?.colors?.primary?.main}`
          : `${theme?.colors?.primary?.white}`};
      border: ${({ theme }) =>
        `1px solid ${color || theme?.colors?.primary?.dark}`};
    `}
  cursor: pointer;
  // border-radius: 2px;
  transition: all 150ms;

  ${HiddenCheckbox}:hover + & {
    box-shadow: ${({ theme }) =>
    `inset 0 0px 5px 1px ${theme?.shadows?.radiochecked}`};
  }

  ${Icon} {
    visibility: ${({ checked }) => (checked ? 'visible' : 'hidden')};
  }

  ${({ disabled, disabledVariant, theme }) =>
    disabled &&
    disabledVariant === 'greyed' &&
    `
    background-color: ${theme?.colors?.grey?.['100']};
    border-color: rgba(0,0,0,0.1);
  `}
  ${({ customStyle }) => customStyle}
`
export const CheckBoxLabel = styled.label`
  cursor: pointer;
  margin-left: 10px;
  ${colorMixin};
`

export const CheckBoxWrapper = styled.span<ICheckboxProps>`
  display: flex;
  align-items: center;
  ${({ disabled, disabledVariant }) =>
    disabled && disabledVariant === 'transparent'
      ? 'opacity: 0.3'
      : 'opacity: 1'}
`

export const StyledColorCircle = styled.div<ICheckboxProps>`
  display: inline-block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: ${({ theme }) => `1px solid ${theme?.colors?.white}`};
  background-color: ${({ theme, color, disabled }) =>
    disabled ? theme?.colors?.grey?.inputBorder : color};
  cursor: pointer;
  transition: all 150ms;
  margin-left: 10px;
  margin-right: 0px;
  margin-bottom: 5px;
`
