import { OptionType } from '../Dropdown/interface'

export interface IBreadcrumbOptionsProps {
    id: string
    label?: string
    disabled?: boolean
    toolTipMessage?: string
}

export interface IBreadcrumbProps {
    options: IBreadcrumbOptionsProps[]
    onClick?: (id: string) => void
    optionList?: Array<OptionType>
    width?: string,
    onSetAsFavourite?: (favourite: OptionType) => void
    variant?: string
}