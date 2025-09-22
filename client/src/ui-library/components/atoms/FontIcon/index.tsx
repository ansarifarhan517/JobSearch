import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import type { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'

interface IFontIconProps extends Omit<FontAwesomeIconProps, 'text'> {
  icon: IconDefinition;
  size?: SizeProp;
  color?: string;
  hoverColor?: string;
}

const IconStyled = styled(FontAwesomeIcon).withConfig({
  shouldForwardProp: (prop) => !['text'].includes(prop),
}) <IFontIconProps>`
  color: ${({ color, theme }) =>
    color?.split('.').reduce((state, property) => state?.[property], theme?.colors)};
  /* font-size: ${({ theme, size }) =>
    typeof size === 'number' ? size : theme?.fontIcons?.[size ?? 'md']}px;
  line-height: ${({ theme, size }) =>
    typeof size === 'number' ? size : theme?.fontIcons?.[size ?? 'md']}px;
  height: ${({ theme, size }) =>
    typeof size === 'number' ? size : theme?.fontIcons?.[size ?? 'md']}px; */
  vertical-align: middle;
  &:hover {
    color: ${({ hoverColor, theme }) =>
    hoverColor?.split('.').reduce((state, property) => state?.[property], theme?.colors)};
  }
`

const FontIcon: React.FC<IFontIconProps> = ({
  icon,
  size,
  color,
  hoverColor,
  ...rest
}) => <IconStyled icon={icon} size={size} color={color} hoverColor={hoverColor} {...rest} />

export default FontIcon
