import { ITextInputProps } from '../TextInput'
import { ReactNode } from 'react'

export interface IDatePickerProps {
  id?: string
  name?: string
  className?: string
  label?: string
  selected?: Date
  variant?: tDatePicker
  dropdown?: boolean
  timeInterval?: number
  startYear?: number
  endYear?: number
  disabled?: boolean
  placeholder?: string
  timeFormat?: tTimeFormat
  style?: object
  showTime?: boolean
  tillMinDate?: Date | null
  tillMaxDate?: Date | null
  excludeDates?: Date[]
  required?: boolean
  error?: boolean
  errorMessage?: string
  excludeTimes?: Date[]
  onChange?: (d: Date | [Date, Date] | undefined) => void
  dateToString?: (d: Date) => string
  onOutsideClick?: () => void
  showDaysRange?: boolean
}

export interface IDatePicker extends IDatePickerProps {
  children: ({ value, open, setOpen }: tDatePickerChildren) => ReactNode
}

export type tDatePickerChildren = {
  value?: Date
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedDay?: React.Dispatch<React.SetStateAction<string>>
  setNextCounter?: React.Dispatch<React.SetStateAction<number>>
  setPreviousCounter?: React.Dispatch<React.SetStateAction<number>>
  setCounter?: React.Dispatch<React.SetStateAction<number>>
  selectedDay?: string
  previousCounter?: number
  nextCounter?: number
  counter?: number
}
export type tDateRangeChildren = {
  value: [Date, Date]
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export interface IDateRangePickerProps extends IDatePickerProps {
  startDate?: Date | undefined
  endDate?: Date | undefined
  onFromChange?: (d: Date | [Date, Date] | null) => void
  onToChange?: (d: Date | [Date, Date] | null) => void
  onApply?: (d: Date | [Date, Date] | null) => void
  open?: boolean
  onOpen?: () => void
  onCancel?: () => void
  validationMessage?: string
  children: ({ value, open, setOpen }: tDateRangeChildren) => ReactNode
  fromDateFormatter?: (date: Date) => string
  toDateFormatter?: (date: Date) => string
  userDefinedDateRanges?: IPreDefinedDateRanges[]
  stringToDate?: (input: string) => Date | undefined
}

export type tDatePicker = 'date' | 'datetime' | 'time' | 'daterange'

export type tTimeFormat = 12 | 24

export type tCustomTextInput = {
  value: any
  onClick: () => void
}
export interface IDateRangeProps {
  startDate: Date
  endDate: Date | null
}
export interface ISelectionTrack {
  startDate: Date
  endDate: Date
  highlight: boolean
  click: number
  hover: Date | null
}

export interface CustomTimeInputProps {
  value?: string
  onChange?: (value: Date | string) => void
  handleClick?: () => void
  tInterval?: number
  tFormat: number
  startTime?: boolean
  endTime?: boolean
  markCurrentTime?: boolean
}

export interface CustomTextInputProps extends ITextInputProps {
  onlyTime?: boolean
  name?: string
  width?: string
  dateToString?: (d: Date) => string
}

export interface IPreDefinedDateRanges {
  label: string
  startDate: Date
  endDate: Date
}
