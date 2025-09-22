import React from 'react'
import styled from 'styled-components'
import Box, { type IBoxProps } from '../Box'

export interface IPositionProps extends IBoxProps {
  type?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'unset';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  zIndex?: string;
}

export const PositionStyled = styled(Box) <IPositionProps>`
   ${({ type, top, bottom, left, right, zIndex }) => `
    position: ${type};
    top: ${top};
    bottom: ${bottom};
    left: ${left};
    right: ${right};
    z-index:${zIndex};
     `}
`

const Position = ({ type = 'relative', ...rest }: IPositionProps) => (
  <PositionStyled type={type} {...rest} />
)

export default Position