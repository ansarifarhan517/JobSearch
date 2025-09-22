import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Typography from '../../atoms/Typography'
import Position from '../../atoms/Position'

export interface ISectionHeaderProps {
    children?: ReactNode
    headerTitle: JSX.Element | string
    fontWeight?: number
}

const SectionHeaderStyled = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.grey['200']};
  width: 100%;
  padding: 0.7em 0;
  & > * {
    display: inline-block;
    padding: 0px;
  }
`
const GreyBottomStyled = styled.div`
  border-top: 0.3em solid ${({ theme }) => theme?.colors?.grey['200']};
  width: calc(25% - 15px);
`
const SectionHeader = ({
  children,
  headerTitle,
  fontWeight = 400,
  ...rest
}: ISectionHeaderProps) => (
  <Position display="block" type="relative">
    <SectionHeaderStyled>
      <Typography
        fontSize="14px"
        color="black"
        text-transform="capitalize"
        fontWeight={fontWeight}
        {...rest}
      >
        {headerTitle}
      </Typography>
      {children}
    </SectionHeaderStyled>
    <GreyBottomStyled />
  </Position>
)
export default SectionHeader
