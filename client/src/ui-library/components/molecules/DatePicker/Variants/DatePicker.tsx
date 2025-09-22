import React, { useState, useEffect } from 'react'
import DatePickerPlugin from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import IconButton from '../../../atoms/IconButton'
import IconDropdown from '../../IconDropdown'
import { IMultiSelectOptions as tYearArray } from '../../MultiSelect/interfaces'

import { IDatePicker } from '../interfaces'

import {
  DatePickerStyled,
  CustomHeaderStyled,
  DatePickerWrapper,
  ButtonSetStyled
} from '../Styles/DatePicker.styles'

import { CustomTimeInput } from '../Utils/components'
import { createArrayofObjects, handleTimeOpen } from '../Utils/functions'
import Box from '../../../atoms/Box'

// dropdown month and year creation
const year: tYearArray[] = createArrayofObjects(
  new Date().getFullYear() - 70,
  new Date().getFullYear() + 30
)
const months = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' }
]

const TodaysDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
)
/** ******* Date Picker Plugin Starts **********/

const DatePicker = ({
  className = 'DatePicker',
  label,
  variant = 'date',
  timeInterval = 15,
  disabled = false,
  placeholder,
  timeFormat = 24,
  style,
  tillMinDate,
  tillMaxDate,
  excludeDates,
  error,
  required,
  errorMessage,
  onChange,
  dateToString,
  id = '',
  name = '',
  children,
  selected,
  showDaysRange = false,
  ...props
}: IDatePicker) => {
  const node = React.useRef(null)
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<Date | undefined>(selected)
  const [getCurrentTime, setGetCurrentTime] = useState(false)
  const [showHomeDate, setShowHomeDate] = useState(false)
  // const [day]= useState('')
  const [count, setCount] = useState({
    date: false,
    time: false
  })
  const [nextCounter, setNextCounter] = useState(2)
  const [previousCounter, setPreviousCounter] = useState(2)
  const [counter, setCounter] = useState(1)
  const [selectedDay, setSelectedDay] = useState('Tomorrow')
  useEffect(() => {
    setOpen(false)
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  // selected date is changed
  useEffect(() => {
    selected && setState(selected)
  }, [selected])

  // set state change
  useEffect(() => {
    if (count.date || count.time) {
      variant === 'datetime' && setOpen(true)
    }
  }, [state, count])

  // if date and time both clicked once then close datetimepicker
  useEffect(() => {
    if (count.date && count.time) {
      setOpen(false)
      setCount({
        date: false,
        time: false
      })
    }
  }, [count])

  // handle each change
  const handleChange = (date: Date | [Date, Date] | null, count?: number) => {
    var d = Array.isArray(date) ? date[0] : date === null ? undefined : date
    const daycounter =
      selectedDay === 'Next'
        ? nextCounter
        : selectedDay === 'Previous'
        ? -previousCounter
        : count || counter
    if (showDaysRange && d) {
      var newDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + daycounter,
        new Date(d).getHours(),
        new Date(d).getMinutes(),
        new Date(d).getSeconds()
      )
      setState(newDate)
      onChange && onChange(newDate)

      return
    } else {
      setState(d)
      onChange && onChange(d)
    }
    setShowHomeDate(false)
    setOpen(!open)
  }
  const setDate = () => {
    setOpen(!open)
  }
  // close datetime picker when clicked outside
  const handleOutsideClick = (e: any) => {
    const n = (node.current as unknown) as Node
    if (n.contains(e.target)) return
    setOpen(false)
  }

  // handle time click
  const handleTimeClick = () => {
    setCount({
      ...count,
      time: true
    })
  }

  // handle day click
  const handleDayClick = () => {
    setCount({
      ...count,
      date: true
    })
  }
  const highlightWithRanges = [
    {
      'react-datepicker__day--homeDate': [TodaysDate]
    }
  ]
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
      ),
      count: 0
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
      ),
      count: -1
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
      ),
      count: 1
    },
    {
      label: 'Next',
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 2
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 2
      ),
      counter: true
    },
    {
      label: 'Previous',
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 2
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 2
      ),
      counter: true
    }
  ]
  useEffect(() => {
    if (selectedDay === 'Next') {
      setCounter(nextCounter)
    } else if (selectedDay === 'Previous') {
      setCounter(previousCounter)
    } else {
      setCounter(counter)
    }
  }, [previousCounter, nextCounter, counter])

  return (
    <DatePickerWrapper ref={node}>
      {children({
        value: state,
        open,
        setOpen,
        setSelectedDay,
        setNextCounter,
        setPreviousCounter,
        setCounter,
        selectedDay,
        nextCounter,
        previousCounter,
        counter
      })}

      {open && (
        <DatePickerStyled
          style={style}
          className={showDaysRange ? 'datepickerWithDays' : ''}
        >
          {showDaysRange && (
            <div className='daterange--side-panel'>
              <div className='predefined-date-range'>
                {defaultPreDefinedDateRanges.map(
                  ({ label, counter, count, startDate }, index) => (
                    <label htmlFor={`id-${label}`} key={index}>
                      <input
                        type='radio'
                        name='side-panel-label'
                        value={label}
                        className='side-panel-label-radio'
                        id={`id-${label}`}
                        checked={label === selectedDay}
                        readOnly
                        onChange={(e) => {
                          setSelectedDay(e.target.value)
                          setCounter(count || 0)
                          handleChange(startDate, count)
                        }}
                      />
                      {counter ? (
                        <div
                          key={index}
                          className='side-panel-label counter-label'
                        >
                          <div>{label}</div>
                          {label === selectedDay && (
                            <div>
                              <span
                                className='counter'
                                onClick={() => {
                                  label === 'Next'
                                    ? setNextCounter(
                                        nextCounter !== 2
                                          ? nextCounter - 1
                                          : nextCounter
                                      )
                                    : setPreviousCounter(
                                        previousCounter !== 2
                                          ? previousCounter - 1
                                          : previousCounter
                                      )
                                  handleChange(startDate, count)
                                }}
                              >
                                --
                              </span>

                              <span>
                                <input
                                  type='text'
                                  value={
                                    label === 'Next'
                                      ? nextCounter
                                      : previousCounter
                                  }
                                  min={2}
                                  width='30'
                                  height='20'
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 38) {
                                      label === 'Next'
                                        ? setNextCounter(nextCounter + 1)
                                        : setPreviousCounter(
                                            previousCounter + 1
                                          )
                                      handleChange(startDate, count)
                                    } else if (e.keyCode === 40) {
                                      label === 'Next'
                                        ? setNextCounter(
                                            nextCounter > 2
                                              ? nextCounter - 1
                                              : nextCounter
                                          )
                                        : setPreviousCounter(
                                            previousCounter > 2
                                              ? previousCounter - 1
                                              : previousCounter
                                          )
                                      handleChange(startDate, count)
                                    }
                                  }}
                                />
                                <span
                                  className='counter'
                                  onClick={() => {
                                    label === 'Next'
                                      ? setNextCounter(nextCounter + 1)
                                      : setPreviousCounter(previousCounter + 1)
                                    handleChange(startDate, count)
                                  }}
                                >
                                  +
                                </span>
                              </span>

                              <span className='days'>Day(s)</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div key={index} className='side-panel-label'>
                          {label}
                        </div>
                      )}
                    </label>
                  )
                )}
              </div>
              <div>
                <ButtonSetStyled>
                  <IconButton
                    onClick={() => {
                      setDate()
                    }}
                    primary
                    intent='default'
                    iconVariant='icomoon-tick-circled'
                    children='Apply'
                  />
                  <IconButton
                    onClick={() => {
                      setOpen(!open)
                    }}
                    primary={false}
                    intent='default'
                    iconVariant='icomoon-close'
                    children='Cancel'
                  />
                </ButtonSetStyled>
              </div>
            </div>
          )}
          <DatePickerPlugin
            renderCustomHeader={(
              // custom Header
              {
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled
              }
            ) => (
              <CustomHeaderStyled>
                <IconButton
                  onClick={decreaseMonth}
                  onlyIcon
                  iconVariant='angle-left'
                  iconSize='xs'
                  color='black'
                  disabled={prevMonthButtonDisabled}
                />
                <IconButton
                  onClick={() => {
                    changeMonth(new Date().getMonth())
                    changeYear(new Date().getFullYear())
                    setShowHomeDate(true)
                    setGetCurrentTime(true)
                  }}
                  onlyIcon
                  iconVariant='picker-home'
                  iconSize='sm'
                  color='grey.A800'
                  style={{ marginTop: '-2px' }}
                />
                <div style={{ marginTop: '1px', display: 'flex' }}>
                  <Box mr='15px'>
                    <IconDropdown
                      variant='date-picker'
                      optionList={months}
                      onChange={(value: string | undefined) => {
                        return (
                          value &&
                          changeMonth(
                            months.map(({ label }) => label).indexOf(value)
                          )
                        )
                      }}
                      value={months[date?.getMonth()]?.value}
                      width='80px'
                      showDownArrow
                    />
                  </Box>
                  <IconDropdown
                    variant='date-picker'
                    optionList={year}
                    onChange={(value: string | undefined) =>
                      value && changeYear((value as unknown) as number)
                    }
                    value={date?.getFullYear().toString()}
                    width='46px'
                    showDownArrow
                  />
                </div>
                <IconButton
                  onClick={increaseMonth}
                  onlyIcon
                  iconVariant='angle-right'
                  iconSize='xs'
                  color='black'
                  disabled={nextMonthButtonDisabled}
                />
              </CustomHeaderStyled>
            )}
            // custom header ends here
            highlightDates={showHomeDate ? highlightWithRanges : undefined}
            className={className}
            disabled={disabled}
            selected={state}
            onChange={(date) => handleChange(date)}
            placeholderText={placeholder}
            showYearDropdown
            showMonthDropdown
            scrollableMonthYearDropdown
            closeOnScroll
            dateFormat={
              dateToString
                ? 'yyyy-MM-dd HH:mm:ss'
                : variant === 'datetime'
                ? 'MMMM d, yyyy HH:mm'
                : variant === 'time'
                ? 'HH:mm'
                : 'dd/MM/yyyy'
            }
            // Time picker props
            timeFormat='HH:mm'
            showTimeSelectOnly={variant === 'time'}
            timeIntervals={timeInterval || 15}
            showTimeInput={variant === 'datetime' || variant === 'time'}
            customTimeInput={
              <CustomTimeInput
                tFormat={timeFormat}
                tInterval={timeInterval || 15}
                handleClick={handleTimeClick}
                markCurrentTime={getCurrentTime}
              />
            }
            // customDay
            renderDayContents={(day) => {
              return <div onClick={handleDayClick}>{day}</div>
            }}
            // min and max date
            minDate={tillMinDate || null}
            maxDate={tillMaxDate || null}
            excludeDates={excludeDates}
            onCalendarOpen={() =>
              variant === 'time' ? state && handleTimeOpen(state) : null
            }
            formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
            {...props}
            inline
          />
        </DatePickerStyled>
      )}
    </DatePickerWrapper>
  )
}
export default DatePicker
