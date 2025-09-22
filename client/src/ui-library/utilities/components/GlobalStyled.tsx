import React, { type ComponentType } from 'react'

import styled from 'styled-components'
// import { tooltipMixin } from '../mixins'

const GlobalStyled = styled.div`
  ${({ theme }) => `
    font-family: ${theme?.typography?.fontFamily};
    font-size: ${theme?.typography?.fontSize}px;
    .cursor{
      cursor: pointer;
    }
      height: 100%;
      width:100%;
  `}
`

export const withGlobalStyled = <P extends object = object>(
  Component: ComponentType<P>,
) => (props: P) => (
    <GlobalStyled>
      <Component {...props} />
    </GlobalStyled>
  )
export default GlobalStyled