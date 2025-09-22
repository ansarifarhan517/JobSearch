import React from 'react'
import styled from 'styled-components'
import type { IColorProps, IBgColorProps } from '../../../utilities/types'
import { colorMixin, bgColorMixin } from '../../../utilities/components/mixins'

export type tVariant = 'button' | 'link'
export type tIntent = 'default' | 'table' | 'page'

export interface IButtonProps
  extends IColorProps,
  IBgColorProps,
  React.HTMLAttributes<HTMLButtonElement> {
  variant?: 'button' | 'link'
  underline?: boolean
  disabled?: boolean
  primary?: boolean
  intent?: 'default' | 'table' | 'page'
  children?: any
  fullWidth?: boolean
}

// Utility to filter out props that shouldn't be forwarded to the DOM element
const shouldForwardProp = (prop: string) =>
  !['variant', 'underline', 'primary', 'intent', 'fullWidth'].includes(prop)

const ButtonStyled = styled.button.withConfig({ shouldForwardProp }) <IButtonProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ primary, theme }) =>
    (primary && theme?.colors?.primary?.main) ||
    theme?.colors?.primary?.contrastText};
  color: ${({ primary, theme }) =>
    (primary && theme?.colors?.primary?.contrastText) ||
    theme?.colors?.primary?.main};
  ${colorMixin};
  ${bgColorMixin};
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  border: unset;
  line-height: ${({ intent }) =>
    intent === 'table' || intent === 'page' ? 30 : 40}px;
  // margin: 0 5px;
  // padding: ${({ intent }) => (intent === 'table' ? '0px 5px' : '0px 10px')};
  padding: 0px 10px;
  max-height: ${({ intent }) =>
    intent === 'table' || intent === 'page' ? 30 : 40}px;
  text-transform: ${({ intent }) => intent === 'page' && 'uppercase'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: ${({ intent }) => (intent === 'table' ? 12 : 13)}px;
  &:hover {
    box-shadow: ${({ disabled, theme }) => !disabled && theme?.shadows?.hover};
    /*
    background-color: ${({ primary, disabled, theme }) =>
    primary && !disabled && theme?.colors?.primary?.dark};
      */
    /*
      ${({ theme, intent, disabled }) =>
    intent === 'table' &&
    !disabled &&
    `
        color: ${theme?.colors?.primary?.contrastText};
        background-color: ${theme?.colors?.primary?.main};
     `}
    */
  }
  &:focus {
    outline: none;
  }
  * + * {
    margin-left: ${({ intent }) => (intent === 'table' ? 5 : 7)}px;
  }
  ${({ disabled }) => disabled && 'opacity: 0.5;'}
`

const LinkStyled = styled.button<IButtonProps>`
  background-color: transparent;
  border: none;
  color: ${({ theme, disabled }) =>
    disabled ? theme?.colors?.text?.disabled : theme?.colors?.primary?.light};
  text-decoration: ${({ underline }) => underline && 'underline'};
  padding: 5px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    color: ${({ theme, disabled }) =>
    !disabled && theme?.colors?.primary?.main};
  }
  * + * {
    margin-left: 5px;
  }
  &:focus {
    outline: none;
  }
`

const Button = ({
  variant = 'button',
  intent = 'default',
  children = '',
  ...rest
}: IButtonProps) => variant === 'link' ? (
  <LinkStyled intent={intent} {...rest}>
    {children}
  </LinkStyled>
) : (
  <ButtonStyled intent={intent} {...rest}>
    {children}
  </ButtonStyled>
)

export default Button
