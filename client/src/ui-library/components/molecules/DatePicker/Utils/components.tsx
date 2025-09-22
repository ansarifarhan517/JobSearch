import React from 'react'

import TextInput from '../../TextInput'
import FontIcon from '../../../atoms/FontIcon'
import IconButton from '../../../atoms/IconButton'

import {
  FontIconStyled,
  TimeContainerStyled,
  TimeContainerScrollabelStyled,
  TimeTabStyled,
  TextInputStyled
} from '../Styles/DatePicker.styles'

import { CustomTextInputProps, CustomTimeInputProps } from '../interfaces'

import {
  handleScrollDown,
  handleScrollUp,
  createArrayofTimeObject,
  createArrayofTime,
  convertTo24HourFormat,
  convertTo12HourFormat,
  binarySearch
} from './functions'
import { faAngleDown, faAngleUp, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'

export const CustomTextInput = ({
  label,
  value,
  onClick,
  onlyTime,
  id,
  name = 'date-picker',
  className,
  style,
  ref,
  dateToString,
  ...props
}: CustomTextInputProps) => {
  return (
    <TextInputStyled onClick={onClick} style={style}>
      <TextInput
        id={id}
        name={name}
        className={className}
        label={label}
        variant='basic'
        labelColor='text.inputLabel.default'
        placeholder='Please Click Here'
        fullWidth
        value={
          dateToString
            ? value
              ? dateToString(new Date(value + ''))
              : undefined
            : value
        }
        ref={null}
        {...props}
      />
      <FontIconStyled>
        <FontIcon
          icon={onlyTime ? faClockRotateLeft : faCalendar}
          color='white'
          size='lg'
        />
      </FontIconStyled>
    </TextInputStyled>
  )
}

export const CustomTimeInput = ({
  value,
  onChange,
  handleClick,
  tInterval = 15,
  tFormat,
  markCurrentTime
}: CustomTimeInputProps) => {
  const ourTimeArray = createArrayofTimeObject(tInterval, tFormat)
  const node = React.useRef<null | HTMLDivElement>(null)

  React.useEffect(() => {
    if (node.current !== null) {
      node?.current?.scrollIntoView({ block: 'center' })
    }
    if (
      value &&
      ourTimeArray?.indexOf(convertTo12HourFormat(value) as string) === -1
    ) {
      // console.log(convertTo12HourFormat(value))
      value = ''
    }
  }, [value])

  const getCurrentClosestTime = () => {
    const current = new Date().getHours() * 60 + new Date().getMinutes()
    const result = binarySearch(current, createArrayofTime(tInterval, tFormat))
    return result
  }

  return (
    <TimeContainerStyled>
      <IconButton
        onClick={() => handleScrollUp('scrollable-div')}
        onlyIcon
        iconVariant={faAngleUp}
        iconSize='xs'
        color='black'
        style={{ margin: 'auto' }}
      />
      <TimeContainerScrollabelStyled id='scrollable-div'>
        {ourTimeArray.map((time: string, index: number) => (
          <TimeTabStyled
            key={index}
            aria-time={time}
            className={`timeLabel ${value === (convertTo24HourFormat(time, tFormat) as string)
                ? 'selected-time'
                : markCurrentTime && time === getCurrentClosestTime()
                  ? 'selected-time'
                  : 'not-selected'
              }`}
            onClick={() => {
              handleClick && handleClick()
              onChange && onChange(convertTo24HourFormat(time, tFormat))
            }}
            ref={
              value === (convertTo24HourFormat(time, tFormat) as string)
                ? node
                : value === '' ||
                  (value &&
                    ourTimeArray?.indexOf(
                      convertTo12HourFormat(value) as string
                    ) === -1)
                  ? time === getCurrentClosestTime()
                    ? node
                    : null
                  : null
            }
          >
            {time}
          </TimeTabStyled>
        ))}
      </TimeContainerScrollabelStyled>
      <IconButton
        onClick={() => handleScrollDown('scrollable-div')}
        onlyIcon
        iconVariant={faAngleDown}
        iconSize='xs'
        color='black'
        style={{ margin: 'auto' }}
      />
    </TimeContainerStyled>
  )
}
