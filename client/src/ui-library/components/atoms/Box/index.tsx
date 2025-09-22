import React, { type ReactElement } from 'react'
import styled from 'styled-components'
import {
  marginMixin,
  paddingMixin,
  flexMixin,
  colorMixin,
  bgColorMixin,
  borderMixin,
  spacingMixin,
} from '../../../utilities//components/mixins'

import type {
  IPaddingProps,
  IMarginProps,
  IFlexProps,
  IBgColorProps,
  IColorProps,
  IBorderProps,
  tDisplay,
} from '../../../utilities/types'

export interface IBoxProps
  extends IPaddingProps,
  IMarginProps,
  IFlexProps,
  IColorProps,
  IBgColorProps,
  IBorderProps,
  React.HTMLAttributes<HTMLDivElement> {
  horizontalSpacing?: number | string
  verticalSpacing?: number | string
  fullWidth?: boolean
  fullHeight?: boolean
  display?: tDisplay
  children?: any
}

// List of props to filter out from being passed to the HTML div
const shouldForwardProp = (prop: string) =>
  !['flexDirection', 'justifyContent', 'alignItems',
    'fullWidth', 'fullHeight', 'bgColor', 'border'
    , 'borderTop'
    , 'borderBottom'
    , 'borderRight'
    , 'borderLeft'
    , 'borderRadius'
    , 'borderColor','horizontalSpacing'].includes(prop)


export const BoxStyled = styled.div.withConfig({ shouldForwardProp }) <IBoxProps>`
  display: ${({ display = 'block' }) => display};
  box-sizing: inherit;
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  ${({ fullHeight }) => fullHeight && 'height: 100%;'}
  ${colorMixin};
  ${bgColorMixin};
  ${marginMixin};
  ${paddingMixin};
  ${flexMixin};
  ${borderMixin};
  ${spacingMixin};
`
const Box = ({
  display = 'block',
  flexDirection = 'row',
  justifyContent = 'flex-start',
  alignItems = 'center',
  children,
  ...rest
}: IBoxProps): ReactElement => (
  <BoxStyled
    display={display}
    flexDirection={flexDirection}
    justifyContent={justifyContent}
    alignItems={alignItems}
    {...rest}
  >
    {children}
  </BoxStyled>
)

export default Box
