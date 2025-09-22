import React from 'react'
import Button, { type IButtonProps } from '../Button'
import FontIcon from '../FontIcon'
import styled, { css } from 'styled-components'
import type{ IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type  { SizeProp } from '@fortawesome/fontawesome-svg-core'
export interface IIconButtonProps extends IButtonProps {
  circle?: boolean
  iconVariant: IconDefinition
  onlyIcon?: boolean
  minWidth?: string
  /** number | xs | sm | md | lg | xl */
  iconSize?: SizeProp
  hoverFeedback?: boolean
}

const shouldForwardProp = (prop: string) =>
  !['iconVariant', 'iconSize', 'onlyIcon', 'hoverFeedback', 'minWidth'].includes(prop)

export const IconButtonStyled = styled(Button).withConfig({ shouldForwardProp }) <IIconButtonProps>`
  ${({ circle, disabled }) =>
    circle &&
    css`
      box-shadow: none;
      &:hover {
        box-shadow: none;
      }
      border-radius: 50%;
      padding: 10px;
      border: ${({ theme }) =>
    disabled
      ? `1px solid ${theme?.colors?.text?.disabled}`
      : `1px solid ${theme?.colors?.primary?.main}`};
    `}
  span {
    font-size: ${({ theme }) => `${theme?.typography?.fontSize}px`};
  }
  i {
    display: flex;
  }
  ${({ disabled, circle }) =>
    !disabled &&
    circle &&
    css`
      &:hover {
        background-color: ${({ theme }) =>
    !disabled && `${theme?.colors?.primary?.main}`};
        color: ${({ theme }) => !disabled && `${theme?.colors?.white}`};
      }
    `}
  display:flex;
  span {
    font-size: ${({ intent }) =>
    intent === 'table' ? 10 : intent === 'page' ? 13 : 15}px;
  }
  i {
    font-size: ${({ intent }) =>
    intent === 'table' ? 10 : intent === 'page' ? 13 : 19}px;
    height: ${({ intent }) =>
    intent === 'table' ? 10 : intent === 'page' ? 13 : 19}px;
    line-height: ${({ intent }) =>
    intent === 'table' ? 10 : intent === 'page' ? 13 : 19}px;

    display: flex;
  }
  transition: 0.2s ease-in;
`
export const OnlyIconButtonStyled = styled(Button).withConfig({ shouldForwardProp }) <IIconButtonProps>`
  box-shadow: none;
  &:hover {
    box-shadow: none;
  }

  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;

  border: ${({ disabled }) => (disabled ? 'none !important' : 'unset')};
  border-radius: ${({ circle }) => (circle ? '50%' : '0%')};
  padding: 0px 10px;
  background-color: transparent;

  ${({ disabled, theme, hoverFeedback }) =>
    disabled
      ? css`
          & * {
            color: ${theme?.colors?.text?.disabled};
          }
        `
      : hoverFeedback
        ? `
    &:hover {
      background-color: ${theme?.colors?.grey?.['550']}};
      border-radius: 50%;
    }
    `
        : ''}
`

const IconButtonText = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const IconButton = ({
  iconVariant,
  iconSize,
  onlyIcon,
  children,
  hoverFeedback = true,
  ...rest
}: IIconButtonProps) =>
  onlyIcon ? (
    <OnlyIconButtonStyled
      {...rest}
      iconVariant={iconVariant}
      hoverFeedback={hoverFeedback}
    >
      <FontIcon icon={iconVariant} size={iconSize} />
    </OnlyIconButtonStyled>
  ) : (
    <IconButtonStyled {...rest} iconVariant={iconVariant}>
      <FontIcon icon={iconVariant} size={iconSize} />
      {children && <IconButtonText>{children}</IconButtonText>}
    </IconButtonStyled>
  )
export default IconButton
