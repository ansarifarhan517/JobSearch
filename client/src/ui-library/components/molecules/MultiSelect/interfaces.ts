import { InputActionMeta } from 'react-select'

import { ReactNode } from 'react'

export interface IMultiSelectOptions {
  [key: string]: string
  label: string
  value: string
}

export interface ISelectProps {
  loadOptions: (options: any, callback: any) => void
  options?: IMultiSelectOptions[]
  components: Object
  allOption?: IMultiSelectOptions
  value?: IMultiSelectOptions[]
  onChange?: (
    value: string,
    isSelected: boolean,
    selectedOption: IMultiSelectOptions[],
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  allowSelectAll?: boolean
  menuIsOpen?: boolean
  hideSelectedOptions?: boolean
  closeMenuOnSelect?: boolean
  isMulti?: boolean
  styles?: {}
  closeMenuOnScroll?: boolean
  noOptionsMessage?: () => string
  inputValue?: string
  onInputChange?:
    | ((newValue: string, actionMeta: InputActionMeta) => any)
    | undefined

  onMenuOpen?: () => void
  /* Handle the menu closing */
  onMenuClose?: () => void
  onOutsideClick?: () => void
}

export type tMultiSelectChildren = {
  optionSelected: IMultiSelectOptions[]
  isMenuOpen: boolean
  openMenu: React.Dispatch<React.SetStateAction<boolean>>
}
export interface IMultiSelectProps
  extends React.HTMLAttributes<HTMLDivElement> {
  options?: IMultiSelectOptions[]
  width?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value?: string,
    isSelected?: boolean,
    selectedOption?: IMultiSelectOptions[]
  ) => void
  children: ({
    optionSelected,
    isMenuOpen,
    openMenu
  }: tMultiSelectChildren) => ReactNode
  loadOptions?: (inputValue: string, callback: any) => void
  isLoading?: boolean
  isNoOption?: boolean
  menuOpen?: boolean
  defaultSelected?: IMultiSelectOptions[]
  selected?: IMultiSelectOptions[]
  allowSelectAll?: boolean
  maximumSelected?: number
  searchableKeys?: string[]
  onMenuOpen?: () => void
  onMenuClose?: () => void
  resultLimit?: number
  onInputChange?: (newValue: string) => void
  onOutsideClick?: () => void
}

export interface tMultiSelectWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
}

export type tCallback = (
  func: IMultiSelectOptions[] | undefined
) => IMultiSelectOptions[]

export interface IValueContainerProps {
  children: IMultiSelectOptions[]
  getValue: () => any
}
