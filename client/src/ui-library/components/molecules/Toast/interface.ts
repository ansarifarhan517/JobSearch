import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"

export interface AppContextInterface {
  add: (content: string, iconVariant: IconDefinition, removeButton: boolean) => any
  remove: (toastId: string) => any
}
export interface IToastProps {
  children: any
  remove: any
  iconVariant: IconDefinition
  handlePause?: (e: MouseEvent) => any
  handleResume?: (e: MouseEvent) => any
  removeButton: boolean
}
export interface IWithToastProvider {
  toastId: string
  content: string
  iconVariant: IconDefinition
  removeButton: boolean
}

export type tRemoveProps = string
