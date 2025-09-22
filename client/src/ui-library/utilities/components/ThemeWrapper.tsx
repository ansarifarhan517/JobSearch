import React from 'react'
import { getDefaultTheme } from '../theme'
import { ThemeProvider } from 'styled-components'
import { withGlobalStyled } from './GlobalStyled'
import type { ITheme } from '../types'
import { withToastProvider } from '@ui-library/components/molecules/Toast'



interface IThemeWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: ITheme
}
const ThemeWrapper = ({
  children,
  theme = getDefaultTheme() }: IThemeWrapperProps) => {


  const WrapperComponent = ({
    children,
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <React.Fragment>{children}</React.Fragment>
  )

  const ConfigComponent =
    withToastProvider(withGlobalStyled(WrapperComponent))

  return (
    <ThemeProvider theme={theme}>
      <ConfigComponent>{children}</ConfigComponent>
    </ThemeProvider>
  )

}

export default ThemeWrapper