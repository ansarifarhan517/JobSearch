import React from 'react'
import styled from 'styled-components'

export type tGridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: boolean
  item?: boolean
  spacing?: string | number
  /** 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 */
  xs?: tGridSize
  /** 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 */
  sm?: tGridSize
  /** 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 */
  md?: tGridSize
  /** 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 */
  lg?: tGridSize
  /** 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 */
  xl?: tGridSize
  children?: any
}

// Utility to filter out props that shouldn't be forwarded to the DOM element
const shouldForwardProp = (prop: string) =>
  !['container', 'item', 'spacing', 'xs', 'sm', 'md', 'lg', 'xl'].includes(prop)

const GridStyled = styled.div.withConfig({ shouldForwardProp }) <GridProps>`
  ${({ container, spacing = '0px' }) =>
    container &&
    `
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    width: calc(100% + ${spacing} + ${spacing});
    
    margin: -${spacing};

    & > * {
      padding: ${spacing};
    }
  `}

  ${({ item, xs, sm, md, lg, xl, theme }) =>
    item &&
    `
      max-height: 100%;
      box-sizing: border-box;
      margin: 0;
      position: relative;
      flex-basis: 0%;
      flex-grow: 1;

      ${xs && theme?.breakpoints?.up('xs')} {
        flex-basis: ${((xs ?? 0) * 100) / 12}%;
        max-width: ${((xs ?? 12) * 100) / 12}%;
        flex-grow: 0;
      }
      ${sm && theme?.breakpoints?.up('sm')} {
        flex-basis: ${((sm ?? 0) * 100) / 12}%;
        max-width: ${((sm ?? 12) * 100) / 12}%;
        flex-grow: 0;
      }
      ${md && theme?.breakpoints?.up('md')} {
        flex-basis: ${((md ?? 0) * 100) / 12}%;
        max-width: ${((md ?? 12) * 100) / 12}%;
        flex-grow: 0;
      }
      ${lg && theme?.breakpoints?.up('lg')} {
        flex-basis: ${((lg ?? 0) * 100) / 12}%;
        max-width: ${((lg ?? 12) * 100) / 12}%;
        flex-grow: 0;
      }
      ${xl && theme?.breakpoints?.up('xl')} {
        flex-basis: ${((xl ?? 0) * 100) / 12}%;
        max-width: ${((xl ?? 12) * 100) / 12}%;
        flex-grow: 0;
      }
  `}
`

const Grid = ({ children, spacing = '0px', ...rest }: GridProps) => (
  <GridStyled {...rest} spacing={spacing}>
    {children}
  </GridStyled>
)

export default Grid
