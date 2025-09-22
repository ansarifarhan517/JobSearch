export interface IAccordianProps {
    id: string
    expanded?: boolean
    onToggle?: (id: string, isExpanded?: boolean) => void
    hideChevron?: boolean
    children: {
      header: JSX.Element
      content: JSX.Element
    }
    showToggleSwitch?: boolean
    onToggleSwitch?: Function
    isToggleChecked?: boolean
    switchTooltipMessage?:string
    switchTooltipProps?: any
    toggleSwitchStyle?: React.CSSProperties
    toggleSwitchDisable?:boolean
  }
  