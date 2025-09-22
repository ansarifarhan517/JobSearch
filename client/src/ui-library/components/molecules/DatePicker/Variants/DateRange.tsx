import React, { useState, useEffect } from 'react'
import DatePickerPlugin from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TextInput from '../../TextInput'
import IconButton from '../../../atoms/IconButton'
import IconDropdown from '../../IconDropdown'
import {
  IDateRangePickerProps,
  ISelectionTrack,
  CustomTimeInputProps,
  IPreDefinedDateRanges
} from '../interfaces'

import {
  DateRangePickerContainer,
  DateRangePickerStyled,
  ButtonSetStyled,
  TextInputStyled,
  DateRangeStyled,
  StyledCalendarDayButton,
  TimeContainerStyled,
  IconColonStyled,
  DateRangeWrapper
} from '../Styles/DateRange.styles'

import {
  createArrayofObjects,
  getNextMonth,
  getPreviousMonth,
  compareDatesWithTimes,
  compareDates,
  equals,
  convertTo24Hour,
  convertTo12Hour,
  convertStringToDate,
  findWhetherDateMatches,
  getMonthBoudaries
} from '../Utils/functions'
import { useToast } from '../../Toast'

const hours = createArrayofObjects(0, 23, true)
const minutes = createArrayofObjects(0, 59, true)
const defaultPreDefinedDateRanges = [
  {
    label: 'Today',
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  },
  {
    label: 'Yesterday',
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1
    )
  },
  {
    label: 'Tomorrow',
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )
  },
  {
    label: 'This week',
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - new Date().getDay()
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  },
  {
    label: 'Last 7 Days',
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 6
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  },
  {
    label: 'This month',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  },
  {
    label: 'Last 30 Days',
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate() + 1
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  },
  { label: 'Custom Date', startDate: new Date(), endDate: new Date() }
]

/** ******* Date Picker Plugin Starts **********/

const DateRangePicker = ({
  timeFormat = 12,
  showTime = true,
  startDate = new Date(),
  endDate = new Date(),
  tillMinDate,
  tillMaxDate,
  onFromChange,
  onToChange,
  onApply,
  children,
  onCancel = () => {},
  style,
  validationMessage = "",
  fromDateFormatter,
  toDateFormatter,
  userDefinedDateRanges,
  stringToDate = convertStringToDate,
  open = false,
  onOutsideClick
}: IDateRangePickerProps) => {
  const [value, setValue] = useState<[Date, Date]>([startDate, endDate])
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const [months, setmonths] = useState({
    firstMonth: startDate,
    secondMonth: new Date()
  })
  const [disableIncreaseMonth, setDisableIncreaseMonth] = useState<boolean>(
    (tillMaxDate && new Date() >= tillMaxDate) || false
  )
  const [disableDecreaseMonth, setDisableDecreaseMonth] = useState<boolean>(
    (tillMinDate && startDate >= tillMinDate) || false
  )
  const [firstMonthBoundaries, setFirstMonthBoundaries] = useState(
    getMonthBoudaries(startDate, tillMinDate, tillMaxDate)
  )
  const [secondMonthBoundaries, setSecondMonthBoundaries] = useState(
    getMonthBoudaries(new Date(), tillMinDate, tillMaxDate)
  )
  const [selectionTrack, setSelectionTrack] = useState<ISelectionTrack>({
    startDate: startDate,
    endDate: endDate,
    highlight: false,
    click: 0,
    hover: new Date()
  })
  const [predefinedRangesEvents, setPredefinedRangesEvents] = useState({
    fixedDateRanges: false,
    customDate: false
  })
  const baseStartHrs = startDate.getHours()
  const baseEndHrs = endDate.getHours()
  const startHrsFormatted = timeFormat === 12 && baseStartHrs > 12 ? (baseStartHrs % 12) : baseStartHrs
  const endHrsFormatted = timeFormat === 12 && baseEndHrs > 12 ? (baseEndHrs % 12) : baseEndHrs
  const [time, setTime] = useState({
    startTime: {
      hours: (startHrsFormatted as unknown) as string,
      minutes: (startDate.getMinutes() as unknown) as string,
      daytime: startDate.getHours() > 12 ? 'PM' : 'AM'
    },
    endTime: {
      hours: (endHrsFormatted as unknown) as string,
      minutes: (endDate.getMinutes() as unknown) as string,
      daytime: endDate.getHours() > 12 ? 'PM' : 'AM'
    }
  })
  const node = React.useRef(null)

  const handleOutsideClick = (e: any) => {
    const n = (node.current as unknown) as Node
    if (n.contains(e.target)) return
    setIsOpen(false)
    onOutsideClick && onOutsideClick()
  }
  const toast = useToast()
  const showToast = () => { validationMessage.trim()!=="" && toast.add(validationMessage, 'warning', false) }

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    setValue([startDate, endDate])
    setmonths({
      firstMonth: startDate,
      secondMonth: getNextMonth(startDate)
    })
  }, [startDate])

  useEffect(() => {
    selectionTrack.startDate.getMonth() < months.firstMonth.getMonth() &&
      handleDecreaseMonth()
  }, [selectionTrack.startDate])

  useEffect(() => {
    saveDateRange()
  }, [time])

  useEffect(() => {
    setmonths({
      firstMonth: months.firstMonth,
      secondMonth: getNextMonth(months.firstMonth)
    })
  }, [])

  useEffect(() => {
    setSelectionTrack({
      ...selectionTrack,
      highlight: compareDatesWithTimes(startDate, endDate),
      click: 2,
      hover: new Date()
    })

    const isCustomDate = !findWhetherDateMatches(
      selectionTrack.startDate,
      selectionTrack.endDate,
      preDefinedDateRanges
    )

    setPredefinedRangesEvents({
      fixedDateRanges: !isCustomDate,
      customDate: isCustomDate
    })
  }, [startDate, endDate])

  useEffect(() => {
    if (predefinedRangesEvents.fixedDateRanges) {
      saveDateRange()
      onApply && onApply([selectionTrack.startDate, selectionTrack.endDate])
      handleOpen()
    }

    setEditableDates({
      from: fromDateFormatter
        ? fromDateFormatter(selectionTrack.startDate)
        : ((selectionTrack.startDate as unknown) as string),
      to: toDateFormatter
        ? toDateFormatter(selectionTrack.endDate)
        : ((selectionTrack.endDate as unknown) as string)
    })

    const isCustomDate = !findWhetherDateMatches(
      selectionTrack.startDate,
      selectionTrack.endDate,
      preDefinedDateRanges
    )

    setPredefinedRangesEvents({
      fixedDateRanges: !isCustomDate,
      customDate: isCustomDate
    })
  }, [selectionTrack.startDate, selectionTrack.endDate])

  useEffect(() => {
    setEditableDates({
      from: fromDateFormatter
        ? fromDateFormatter(value[0])
        : ((value[0] as unknown) as string),
      to: toDateFormatter
        ? toDateFormatter(value[1])
        : ((value[1] as unknown) as string)
    })
  }, [value])

  useEffect(() => {
    const firstMonth = months.firstMonth
    const secondMonth = months.secondMonth
    setFirstMonthBoundaries(
      getMonthBoudaries(firstMonth, tillMinDate, tillMaxDate)
    )
    setSecondMonthBoundaries(
      getMonthBoudaries(secondMonth, tillMinDate, tillMaxDate)
    )
    setDisableDecreaseMonth(
      (tillMinDate &&
        new Date(firstMonth.getFullYear(), firstMonth.getMonth(), 1) <=
          tillMinDate) ||
        false
    )
    setDisableIncreaseMonth(
      (tillMaxDate &&
        new Date(secondMonth.getFullYear(), secondMonth.getMonth() + 1, 0) >=
          tillMaxDate) ||
        false
    )
  }, [months])

  // get current months back
  const bringMonthsBackToCurrent = (startDate: Date) => {
    setmonths({
      firstMonth: startDate,
      secondMonth: getNextMonth(startDate)
    })
  }

  // custom time dropdown
  const CustomTimeInput = ({
    onChange,
    tFormat,
    startTime,
    endTime
  }: CustomTimeInputProps) => {
    const handleMinutes = (m: string) => {
      setTime({
        startTime: {
          minutes: startTime ? m : time.startTime.minutes,
          hours: time.startTime.hours,
          daytime: time.startTime.daytime
        },
        endTime: {
          minutes: endTime ? m : time.endTime.minutes,
          hours: time.endTime.hours,
          daytime: time.endTime.daytime
        }
      })
      const v: string =
        (startTime ? time.startTime.hours : (time.endTime.hours as string)) +
        ':' +
        m
      onChange && onChange(v)
    }
    const handleHours = (h: string) => {

      const handleStartHrs = parseInt(startTime ? h : time.startTime.hours)
      const handleEndHrs = parseInt(endTime ? h : time.endTime.hours)
      const startHrsFormatted = timeFormat === 12 && handleStartHrs > 12 ? (handleStartHrs % 12) : handleStartHrs
      const endHrsFormatted = timeFormat === 12 && handleEndHrs > 12 ? (handleEndHrs % 12) : handleEndHrs
      setTime({
        startTime: {
          minutes: time.startTime.minutes,
          hours: (startHrsFormatted as unknown) as string,
          daytime: startTime ? tFormat === 12 ? time.startTime.daytime : parseInt(h) > 12 ? 'PM' : 'AM' : time.startTime.daytime 
        },
        endTime: {
          minutes: time.endTime.minutes,
          hours: (endHrsFormatted as unknown) as string,
          daytime: endTime ? tFormat === 12 ? time.endTime.daytime : parseInt(h) > 12 ? 'PM' : 'AM' : time.endTime.daytime 
        }
      })
      const v: string =
        h +
        ':' +
        (startTime ? time.startTime.minutes : (time.endTime.minutes as string))
      onChange && onChange(v)
    }
    const handleDayTime = (d: string) => {
      // Set time in the state
      setTime({
        startTime: {
          minutes: time.startTime.minutes,
          hours: time.startTime.hours,
          daytime: startTime ? d : time.startTime.daytime
        },
        endTime: {
          minutes: time.endTime.minutes,
          hours: time.endTime.hours,
          daytime: endTime ? d : time.endTime.daytime
        }
      })

      // sending to the onChange method of DateRange picker
      const v: string = startTime
        ? d === 'PM'
          ? convertTo24Hour(time.startTime.hours) + ':' + time.startTime.minutes
          : convertTo12Hour(time.startTime.hours) + ':' + time.startTime.minutes
        : d === 'PM'
        ? convertTo24Hour(time.endTime.hours) + ':' + time.endTime.minutes
        : convertTo12Hour(time.endTime.hours) + ':' + time.endTime.minutes

      onChange && onChange(v)
    }

    const currentDate: any = startTime
      ? { ...time.startTime }
      : { ...time.endTime }

    const hourArrEquivalent = (hrSelection: number): string => {
      let numberedHr = 0
      if (typeof hrSelection !== 'number') {
        numberedHr = parseInt(hrSelection)
      } else {
        numberedHr = hrSelection
      }
      if (tFormat === 12)
        numberedHr = numberedHr % 12 
   
      return  (tFormat === 12) ? displayHrAray[numberedHr].label : hoursArray[numberedHr].label
    }

    return (
      <TimeContainerStyled>
        <IconDropdown
          variant='date-picker'
          optionList={hoursArray}
          onChange={(id: string | undefined) => id && handleHours(id)}
          value={hourArrEquivalent(currentDate?.hours)}
          width='40px'
        />
        <IconColonStyled>:</IconColonStyled>

        <IconDropdown
          variant='date-picker'
          optionList={minutes}
          onChange={(id: string | undefined) => id && handleMinutes(id)}
          // value={value && value.slice(3, 5)}
          value={
            parseInt(currentDate?.minutes) < 10 &&
            currentDate?.minutes.toString().length === 1
              ? '0' + currentDate?.minutes.toString()
              : currentDate?.minutes.toString()
          }
          width='40px'
        />

        {tFormat === 12 && (
          <React.Fragment>
            {/* <IconColonStyled>:</IconColonStyled> */}

            <IconDropdown
              variant='date-picker'
              optionList={[
                { value: 'AM', label: 'AM' },
                { value: 'PM', label: 'PM' }
              ]}
              onChange={(id: string | undefined) => id && handleDayTime(id)}
              // value={value && parseInt(value?.slice(0, 2)) > 12 ? 'PM' : 'AM'}
              value={currentDate?.daytime}
              width='40px'
            />
          </React.Fragment>
        )}
      </TimeContainerStyled>
    )
  }

  // predefined date ranges for sidebar

  // save date range on clicking Apply
  const saveDateRange = () => {
    const parseStartTimeHrs = parseInt(time.startTime.hours)
    const parseEndTimeHrs = parseInt(time.endTime.hours)
    let newStHrs = parseStartTimeHrs, newEtHrs = parseEndTimeHrs
    if (timeFormat === 12) {
      if(time.startTime.daytime === "PM" && parseStartTimeHrs !== 12) {
        newStHrs = (parseStartTimeHrs + 12)
      } else if(time.startTime.daytime === "AM" && parseStartTimeHrs >= 12) {
        newStHrs = (parseStartTimeHrs % 12)
      } else {
        // newStHrs = parseStartTimeHrs
      }

      if(time.endTime.daytime === "PM" && parseEndTimeHrs !== 12) {
        newEtHrs = (parseEndTimeHrs + 12)
      } else if(time.endTime.daytime === "AM" && parseEndTimeHrs >= 12) {
        newEtHrs = (parseEndTimeHrs % 12)
      } else {
        // newEtHrs = parseEndTimeHrs
      }
    }

    selectionTrack.startDate.setHours(newStHrs)
    selectionTrack.startDate.setMinutes(parseInt(time.startTime.minutes))
    selectionTrack.endDate.setHours(newEtHrs)
    selectionTrack.endDate.setMinutes(parseInt(time.endTime.minutes))
    setValue([selectionTrack.startDate, selectionTrack.endDate])
  }

  // handle isOpen and close of Date picker
  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  // decrease months on clicking left arrow
  const handleDecreaseMonth = () => {
    const secondMonth = months.firstMonth
    const firstMonth = getPreviousMonth(secondMonth)
    setFirstMonthBoundaries(
      getMonthBoudaries(getPreviousMonth(secondMonth), tillMinDate, tillMaxDate)
    )
    setSecondMonthBoundaries(
      getMonthBoudaries(secondMonth, tillMinDate, tillMaxDate)
    )
    setmonths({
      firstMonth: firstMonth,
      secondMonth: secondMonth
    })
  }

  // increase months on clicking right arrow
  const handleIncreaseMonth = () => {
    const firstMonth = months.secondMonth
    const secondMonth = getNextMonth(firstMonth)
    setFirstMonthBoundaries(
      getMonthBoudaries(firstMonth, tillMinDate, tillMaxDate)
    )
    setSecondMonthBoundaries(
      getMonthBoudaries(secondMonth, tillMinDate, tillMaxDate)
    )
    setmonths({
      firstMonth: firstMonth,
      secondMonth: secondMonth
    })
  }

  // changes the date range value in state
  const setDateTo = (startDate: Date, EndDate: Date) => {
    const hourlyStDt = timeFormat === 12 ?
    new Date(startDate.toLocaleDateString("en-US") + ` ${time.startTime.hours}:${time.startTime.minutes} ${time.startTime.daytime}`) : startDate
    const hourlyEnDt = timeFormat === 12 ?
    new Date(EndDate.toLocaleDateString("en-US") + ` ${time.endTime.hours}:${time.endTime.minutes} ${time.endTime.daytime}`) : EndDate
    setSelectionTrack({
      startDate: hourlyStDt,
      endDate: hourlyEnDt,
      highlight: true,
      click: 2,
      hover: null
    })
  }

  // custom day element
  const RenderDayContents = (day: number, date: Date) => {
    const handleMouseOver = (date: Date) => {
      setSelectionTrack({
        ...selectionTrack,
        hover: date
      })
    }

    // handle clicking of startdate and enddate
    const handleDayClick = (date: Date) => {
      const hoverDate = date
      // assignments only for typescript errors 
      let firstClickST = date
      let secondClickST = date
      let firstClickET = date
      let secondClickET = date

      let selectionStartDate = date
      if (timeFormat === 12) {
        selectionStartDate = new Date(selectionStartDate.toLocaleDateString("en-US") + ` ${time.startTime.hours}:${time.startTime.minutes} ${time.startTime.daytime}`) 
      } else {
        selectionStartDate?.setHours(
          time?.startTime?.hours ? parseInt(time?.startTime?.hours) : 0
        )
        selectionStartDate?.setMinutes(
          time?.startTime?.minutes ? parseInt(time?.startTime?.minutes) : 0
        )
      }

      let selectionEndDate = date
      if (timeFormat === 12) {
        selectionEndDate = new Date(date.toLocaleDateString("en-US") + ` ${time.endTime.hours}:${time.endTime.minutes} ${time.endTime.daytime}`) 
      } else {
        selectionEndDate?.setHours(
          time?.endTime?.hours ? parseInt(time?.endTime?.hours) : 0
        )
        selectionEndDate?.setMinutes(
          time?.endTime?.minutes ? parseInt(time?.endTime?.minutes) : 0
        )
      }

      if (selectionTrack.click === 1) {
        secondClickST = selectionTrack.startDate
        secondClickET = selectionEndDate
      } else {
        firstClickST = selectionStartDate
        firstClickET = (compareDatesWithTimes(selectionStartDate, selectionTrack.endDate)) ? selectionTrack.endDate : selectionStartDate
      }

      let dayTimeAppenderST = timeFormat === 12 ? `${time.startTime.daytime}` : ""
      let dayTimeAppenderET = timeFormat === 12 ? `${time.endTime.daytime}` : ""
      // assigning time values for edge cases
      firstClickST = new Date(firstClickST.toLocaleDateString("en-US") + ` ${time.startTime.hours}:${time.startTime.minutes} ${dayTimeAppenderST}`) 
      firstClickET = new Date(firstClickET.toLocaleDateString("en-US") + ` ${time.endTime.hours}:${time.endTime.minutes} ${dayTimeAppenderET}`) 

      secondClickST = new Date(secondClickST.toLocaleDateString("en-US") + ` ${time.startTime.hours}:${time.startTime.minutes} ${dayTimeAppenderST}`) 
      secondClickET = new Date(secondClickET.toLocaleDateString("en-US") + ` ${time.endTime.hours}:${time.endTime.minutes} ${dayTimeAppenderET}`) 
      
      if (
        selectionTrack.click === 1 &&
        compareDates(selectionTrack.startDate, date)
      ) {
        // this is second click, now end date can be assigned
        setSelectionTrack({
          startDate: secondClickST,
          endDate: secondClickET,
          highlight: true,
          click: 2,
          hover: hoverDate
        })
      } else {
        setSelectionTrack({
          startDate: firstClickST,
          endDate: firstClickET,
          highlight: false,
          click: 1,
          hover: hoverDate
        })
      }
    }

    return (
      <StyledCalendarDayButton
        id='date-range-calender-button'
        className={`react-datePicker--day ${
          selectionTrack.hover && equals(date, selectionTrack.hover)
            ? 'react-datepicker--day--hovered-current'
            : selectionTrack.hover &&
              selectionTrack.click === 1 &&
              compareDatesWithTimes(date, selectionTrack?.hover) &&
              compareDatesWithTimes(selectionTrack.startDate, date) &&
              'react-datepicker--day--hovered'
        }
      ' ' 
     
      ${
        equals(selectionTrack.startDate, date)
          ? equals(selectionTrack.startDate, selectionTrack.endDate) &&
           (selectionTrack.click === 2 || !predefinedRangesEvents.customDate)
            ? ' react-datepicker--day--selected-start react-datepicker--day--selected-round'
            : ' react-datepicker--day--selected-start'
          : equals(selectionTrack.endDate, date) &&
            ' react-datePicker--day--selected-end'
      } ' '
      
       ${
         selectionTrack.highlight &&
         selectionTrack.click === 2 &&
         compareDatesWithTimes(selectionTrack.startDate, date) &&
         !compareDatesWithTimes(selectionTrack.endDate, date) &&
         'react-datePicker--day--inrange'
       } `}
        onClick={() => {
          handleDayClick(date)
          setPredefinedRangesEvents({
            fixedDateRanges: false,
            customDate: true
          })
        }}
        onMouseOver={() => handleMouseOver(date)}
      >
        {day}
      </StyledCalendarDayButton>
    )
  }

  const [editableDates, setEditableDates] = useState({
    from: fromDateFormatter
      ? fromDateFormatter(selectionTrack.startDate)
      : ((selectionTrack.startDate as unknown) as string),
    to: toDateFormatter
      ? toDateFormatter(selectionTrack.endDate)
      : ((selectionTrack.endDate as unknown) as string)
  })

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPredefinedRangesEvents({
      ...predefinedRangesEvents,
      fixedDateRanges: false
    })
    // const fromDate = e?.target?.value

    setEditableDates({
      from: e.target.value,
      to: editableDates.to
    })

    // fromDate &&
    //   (equals(fromDate, selectionTrack.endDate) ||
    //     compareDatesWithTimes(fromDate, selectionTrack.endDate)) &&
    //   setSelectionTrack({
    //     ...selectionTrack,
    //     click: 2,
    //     highlight: true,
    //     startDate: fromDate
    //   })
  }
  const handleFromBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    let fromDate = stringToDate(e?.target?.value)
    if (fromDate === undefined) {
      fromDate = startDate
      setEditableDates({
        from: fromDateFormatter
          ? fromDateFormatter(fromDate)
          : ((fromDate as unknown) as string),
        to: editableDates.to
      })
    }

    fromDate &&
      (equals(fromDate, selectionTrack.endDate) ||
        compareDatesWithTimes(fromDate, selectionTrack.endDate)) &&
      setSelectionTrack({
        ...selectionTrack,
        click: 2,
        highlight: true,
        startDate: fromDate
      })
  }
  const handleToBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    let toDate = stringToDate(e?.target?.value)
    if (toDate === undefined) {
      toDate = endDate
      setEditableDates({
        from: editableDates.from,
        to: toDateFormatter
          ? toDateFormatter(toDate)
          : ((toDate as unknown) as string)
      })
    }
    toDate &&
      (equals(selectionTrack.startDate, toDate) ||
        compareDatesWithTimes(selectionTrack.startDate, toDate)) &&
      setSelectionTrack({
        ...selectionTrack,
        click: 2,
        highlight: true,
        endDate: toDate
      })
  }
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPredefinedRangesEvents({
      ...predefinedRangesEvents,
      fixedDateRanges: false
    })
    // const toDate = e?.target?.value

    setEditableDates({
      to: e.target.value,
      from: editableDates.from
    })
    // toDate &&
    //   (equals(selectionTrack.startDate, toDate) ||
    //     compareDatesWithTimes(selectionTrack.startDate, toDate)) &&
    //   setSelectionTrack({
    //     ...selectionTrack,
    //     click: 2,
    //     highlight: true,
    //     endDate: toDate
    //   })
  }

  const preDefinedDateRanges: IPreDefinedDateRanges[] =
    userDefinedDateRanges || defaultPreDefinedDateRanges

  const hoursArray = timeFormat === 12 ? hours.slice(1, 13) : hours
  const displayHrAray = [...hoursArray]
  displayHrAray.unshift({value: '12', label: '12'})

  return (
    <DateRangePickerContainer ref={node}>
      {children({ value, open: isOpen, setOpen: setIsOpen })}
      {isOpen && (
        <DateRangeWrapper style={style}>
          <DateRangePickerStyled>
            <div className='daterange--main-panel'>
              <TextInputStyled>
                <TextInput
                  id='fromDateRange'
                  value={editableDates.from}
                  type='text'
                  label='From'
                  labelColor={selectionTrack.click === 1 ? 'primary.main' : ''}
                  className={
                    selectionTrack.click === 1 ? 'highlight-text-field' : ''
                  }
                  onChange={handleFromChange}
                  onBlur={handleFromBlur}
                />
                <TextInput
                  id='toDateRange'
                  value={editableDates.to}
                  type='text'
                  label='To'
                  labelColor={selectionTrack.click === 2 ? 'primary.main' : ''}
                  className={
                    selectionTrack.click === 2 ? 'highlight-text-field' : ''
                  }
                  onChange={handleToChange}
                  onBlur={handleToBlur}
                />
              </TextInputStyled>
              <DateRangeStyled>
                <IconButton
                  onClick={handleDecreaseMonth}
                  onlyIcon
                  iconVariant='angle-left'
                  iconSize='xs'
                  color='primary.main'
                  className='IconButtonLeft'
                  disabled={disableDecreaseMonth}
                />
                <DatePickerPlugin
                  selected={months.firstMonth}
                  inline
                  showTimeInput={showTime}
                  onChange={(d) => onFromChange && onFromChange(d)}
                  customTimeInput={
                    <CustomTimeInput startTime tFormat={timeFormat} />
                  }
                  renderDayContents={RenderDayContents}
                  // min and max date
                  minDate={firstMonthBoundaries?.minDate}
                  maxDate={firstMonthBoundaries?.maxDate}
                />
                <DatePickerPlugin
                  selected={months.secondMonth}
                  inline
                  showTimeInput={showTime}
                  onChange={(d) => onToChange && onToChange(d)}
                  customTimeInput={
                    <CustomTimeInput endTime tFormat={timeFormat} />
                  }
                  renderDayContents={RenderDayContents}
                  // min and max date
                  minDate={secondMonthBoundaries?.minDate}
                  maxDate={secondMonthBoundaries?.maxDate}
                />
                <IconButton
                  onClick={handleIncreaseMonth}
                  onlyIcon
                  iconVariant='angle-right'
                  iconSize='xs'
                  color='primary-main'
                  className='IconButtonRight'
                  disabled={disableIncreaseMonth}
                />
              </DateRangeStyled>
            </div>
            <div className='daterange--side-panel'>
              <div className='predefined-date-range'>
                {preDefinedDateRanges.map(
                  ({ label, startDate, endDate }, index) => (
                    <label htmlFor={`id-${label}`} key={index}>
                      {preDefinedDateRanges.length - 1 === index ? (
                        <input
                          type='radio'
                          name='side-panel-label'
                          value={label}
                          className='side-panel-label-radio'
                          id={`id-${label}`}
                          checked={predefinedRangesEvents.customDate}
                          readOnly
                        />
                      ) : (
                        <input
                          type='radio'
                          name='side-panel-label'
                          value={label}
                          className='side-panel-label-radio'
                          id={`id-${label}`}
                          checked={
                            equals(selectionTrack.startDate, startDate) &&
                            equals(selectionTrack.endDate, endDate)
                          }
                          readOnly
                        />
                      )}
                      <div
                        key={index}
                        className='side-panel-label'
                        onClick={() => {
                          bringMonthsBackToCurrent(startDate)
                          setDateTo(startDate, endDate)
                          setPredefinedRangesEvents({
                            fixedDateRanges:
                              preDefinedDateRanges.length - 1 !== index,
                            customDate: false
                          })
                        }}
                      >
                        {label}
                      </div>
                    </label>
                  )
                )}
              </div>
              <div>
                <ButtonSetStyled>
                  <IconButton
                    id='dateRange-Apply-Button'
                    onClick={() => {
                      saveDateRange()
                      if (onApply) {
                        if (compareDatesWithTimes(
                          selectionTrack.startDate,
                          selectionTrack.endDate
                        )) {
                          onApply([
                            selectionTrack.startDate,
                            selectionTrack.endDate
                          ])
                        } else {
                          showToast()
                        }
                        handleOpen()
                      }
                    }}
                    primary
                    intent='default'
                    iconVariant='icomoon-tick-circled'
                    children='Apply'
                  />
                  <IconButton
                    id='dateRange-Cancel-Button'
                    onClick={() => {
                      handleOpen()
                      onCancel()
                    }}
                    primary={false}
                    intent='default'
                    iconVariant='icomoon-close'
                    children='Cancel'
                  />
                </ButtonSetStyled>
              </div>
            </div>
          </DateRangePickerStyled>
        </DateRangeWrapper>
      )}
    </DateRangePickerContainer>
  )
}
export default DateRangePicker
