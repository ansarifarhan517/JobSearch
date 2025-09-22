import { ReactNode } from 'react'

export interface IToggleProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelColor?: string
  labelComponent?: ReactNode
  highlightWhenChecked?: boolean
}

export interface IToggleStyle {
  disabled: boolean
}
