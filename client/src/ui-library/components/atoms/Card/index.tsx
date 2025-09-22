import React, { type ReactElement } from 'react'
import styled from 'styled-components'

export interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: any
}

const CardStyled = styled.div<ICardProps>`
  box-sizing: inherit;
  padding: 15px;
  box-shadow: 0 2px 20px -10px #000;
`
const Card = ({ children, ...rest }: ICardProps): ReactElement => <CardStyled {...rest}>{children}</CardStyled>

export default Card
