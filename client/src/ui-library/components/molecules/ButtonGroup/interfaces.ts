import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"

export interface IButtonGroupOption
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  label: string | JSX.Element
  selected?: boolean
  icon?: IconDefinition
  tooltipText?: string | JSX.Element
  height?: string
}

export interface IButtonGroup {
  data: Array<IButtonGroupOption>
  onChange?: (id: string) => void
  width?: string
  height?: string
}

export interface IButtonGroupOption {
  id: string
  selected?: boolean
}
