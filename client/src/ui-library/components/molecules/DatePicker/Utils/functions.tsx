import { IMultiSelectOptions as tYearArray } from '../../MultiSelect/interfaces'
import { IPreDefinedDateRanges } from '../interfaces'

export const createArrayofObjects = (
  start: number,
  end: number,
  prependZero?: boolean
) => {
  const tempArray: tYearArray[] = []
  let current: number = start

  // fill the array until end is reached
  while (end >= current) {
    const CY: string =
      prependZero && current < 10
        ? '0' + current.toString()
        : current.toString()
    tempArray.push({ value: CY, label: CY } as tYearArray)
    current = current + 1
  }
  return tempArray
}

export const createArrayofTimeObject = (
  timeInterval: number,
  timeFormat: number
) => {
  timeInterval = !timeInterval || timeInterval === null ? 15 : timeInterval
  const times: string[] = [] // time array
  let tt: number = 0 // start time
  const ap: String[] = ['AM', 'PM'] // AM-PM

  // loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i++) {
    var hh = Math.floor(tt / 60) // getting hours of day in 0-24 format
    var mm = tt % 60 // getting minutes of the hour in 0-55 format

    let temp = ('0' + (hh % timeFormat)).slice(-2) + ':' + ('0' + mm).slice(-2) // get hh and minutes
    timeFormat === 12 && (temp = temp + ap[Math.floor(hh / 12)]) // pushing data in array in [00:00 - 12:00 AM/PM or 00:00 - 24:00 format]
    times.push(temp)
    tt = tt + timeInterval
  }
  return times
}

export const createArrayofTime = (timeInterval: number, timeFormat: number) => {
  timeInterval = !timeInterval || timeInterval === null ? 15 : timeInterval
  const times: any[] = [] // time array
  let tt: number = 0 // start time
  const ap: String[] = ['AM', 'PM'] // AM-PM
  // loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i++) {
    var hh = Math.floor(tt / 60) // getting hours of day in 0-24 format
    var mm = tt % 60 // getting minutes of the hour in 0-55 format
    // const ap: String[] = ['AM', 'PM']

    let temp = ('0' + (hh % timeFormat)).slice(-2) + ':' + ('0' + mm).slice(-2) // get hh and minutes
    timeFormat === 12 && (temp = temp + ap[Math.floor(hh / 12)])

    // times.push(hh * 60 + mm)
    times.push({ value: hh * 60 + mm, label: temp })
    tt = tt + timeInterval
  }
  return times
}
// time functions
export const handleScrollUp = (container: string) => {
  const element: HTMLElement | null = document.getElementById(container)
  if (element) {
    element.scrollTop = element ? element.scrollTop - 39 * 3 : 0
  }
}

export const handleScrollDown = (container: string) => {
  const element: HTMLElement | null = document.getElementById(container)
  if (element) {
    element.scrollTop = element ? element.scrollTop + 39 * 3 : 0
  }
}

export const handleTimeOpen = (date: Date) => {
  const element: HTMLElement | null = document.getElementById('scrollable-div')
  console.log(date, element)
}
export const convertTo24HourFormat = (time: string, timeFormat: number) => {
  let t
  timeFormat === 12 && time.slice(-2) === 'PM'
    ? (t = parseInt(time.slice(0, 2)) + 12).toString()
    : (t = time.slice(0, 2))
  t = t + ':' + time.slice(3, 5)
  return t
}

export const convertTo12HourFormat = (time: string) => {
  const t =
    parseInt(time.slice(0, 2)) > 12
      ? parseInt(time.slice(0, 2)) - 12 + ':' + time.slice(3, 5) + 'PM'
      : time + 'AM'
  return t
}
export const getTomorrow = () => {
  const daysInMonth = Math.abs(new Date(2019, 11, 40).getDate() - 40)
  const Tom =
    new Date().getDate() === daysInMonth
      ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      : new Date().getMonth() === 11
      ? new Date(new Date().getFullYear() + 1, 0, 0)
      : new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 1
        )
  return Tom
}

export const getNextMonth = (date: Date) => {
  const now = date
  return now.getMonth() === 11
    ? new Date(now.getFullYear() + 1, 0, 1)
    : new Date(now.getFullYear(), now.getMonth() + 1, 1)
}

export const getPreviousMonth = (date: Date) => {
  const now = date
  return now.getMonth() === 0
    ? new Date(now.getFullYear() - 1, 11, 1)
    : new Date(now.getFullYear(), now.getMonth() - 1, 1)
}

export const compareDates = (date1: Date, date2: Date) => {
  const d1 = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
    0,
    0,
    0,
    0
  )
  const d2 = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
    0,
    0,
    0,
    0
  )
  return d1?.getTime() <= d2?.getTime()
}

export const compareDatesWithTimes = (date1: Date, date2: Date) => {
  return date1?.getTime() <= date2?.getTime()
}

export const equals = (date1: Date, date2: Date) => {
  const d1 = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
    0,
    0,
    0,
    0
  )
  const d2 = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
    0,
    0,
    0,
    0
  )
  return d1?.getTime() === d2?.getTime()
}

// Custom Time in Date range input
export const convertTo24Hour = (hour: string) => {
  let h
  if (parseInt(hour) < 12) {
    h = parseInt(hour) + 12
    h = h < 10 ? '0' + h : h
  } else {
    h = hour
  }
  return h
}

export const convertTo12Hour = (hour: string) => {
  let h
  if (parseInt(hour) > 13) {
    h = parseInt(hour) - 12
    h = h < 10 ? '0' + h : h
  } else {
    h = hour
  }
  return h
}

export const binarySearch = (search: number, arr: any[]) => {
  let i = 0
  let j = arr.length - 1
  let mid = arr.length / 2
  let result = ''

  while (i <= j) {
    mid = i + (j - i) / 2
    mid = Math.floor(mid)
    if (arr[mid].value > search) {
      j = mid - 1
      result = arr[mid].label
    } else if (arr[mid].value < search) {
      i = mid + 1
      result = arr[mid].label
    } else if (arr[mid].value === search) {
      result = arr[mid].label
    } else {
      result = arr[mid].label
      break
    }
  }

  return result
}

// convert String to Date
export const convertStringToDate = (input: string) => {
  const finalDate = new Date()
  const dateArray = input.trim().split('/')
  const month = parseInt(dateArray[0])
  if (month <= 12) {
    //  valid day
    finalDate.setMonth(month - 1)

    // set Month
    const day = parseInt(dateArray[1])
    if (day <= 31) {
      finalDate.setDate(day)

      // set year
      const year = parseInt(dateArray[2])
      if (year <= 2050 && year >= 1970) {
        finalDate.setFullYear(year)

        // return finalDate
        return finalDate
      }
    }
  }

  return undefined
}

export const findWhetherDateMatches = (
  startDate: Date,
  endDate: Date,
  arrayOfDates: IPreDefinedDateRanges[]
) => {
  return arrayOfDates.some(
    (p) => equals(startDate, p.startDate) && equals(endDate, p.endDate)
  )
}

export const getMonthBoudaries = (
  month: Date,
  _minDate: Date | null | undefined,
  maxDate: Date | null | undefined
) => {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1)
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const boundaries = {
    minDate: startDate,
    maxDate: endDate
  }
  // if (minDate && minDate >= startDate) {
  //   boundaries.minDate = minDate
  // }

  if (maxDate && maxDate <= endDate) {
    boundaries.maxDate = maxDate
  }
  return boundaries
}
