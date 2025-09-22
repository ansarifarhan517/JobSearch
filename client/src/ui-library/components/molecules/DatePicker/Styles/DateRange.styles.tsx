import styled, { css } from 'styled-components'
import { DatePickerStyled, primaryMixin } from './DatePicker.styles'

export const primaryLightMixin = css`
  background-color: ${({ theme }) => theme?.colors?.primary.light};
  color: ${({ theme }) => theme?.colors?.primary.contrastText};
`
export const DateRangeWrapper = styled.div<
  React.HTMLAttributes<HTMLDivElement>
>`
  display: fit-content;
`
export const DateRangePickerStyled = styled(DatePickerStyled)`
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;
  z-index: ${({ theme }) => theme?.zIndex?.popover};
  position: relative;
  background-color: ${({ theme }) => `${theme?.colors?.primary?.contrastText}`};
  box-shadow: ${({ theme }) => `${theme?.shadows?.default}`};

  .react-datepicker {
    font-size: 12px;
    position: static !important;
    .react-datepicker__navigation--previous,
    .react-datepicker__navigation--next {
      display: none;
    }
    box-shadow: none;
  }
  .react-datepicker__current-month {
    color: ${({ theme }) => theme?.colors?.grey?.A100};
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .react-datepicker__day--selected {
    background-color: transparent !important;
    color: ${({ theme }) => `${theme?.colors?.black}`};
  }

  .react-datepicker__day--in-range {
    ${primaryLightMixin}
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  .react-datepicker__day--outside-month button {
    color: ${({ theme }) => theme?.colors?.grey['300']};
    background-color: transparent !important;
  }

  .IconButtonLeft,
  .IconButtonRight {
    left: 0px;
    z-index: 2;
    position: absolute;
    top: 3px;
  }
  .IconButtonRight {
    right: 0px;
    left: auto;
  }
  .react-datepicker__day-name {
    width: 2em;
    line-height: 1.7em;
    margin: 0.5em;
    padding: 0px;
    font-size: 12px;
    color: ${({ theme }) => theme?.colors?.grey?.inputBorder};
    font-weight: 500;
  }

  /* highlight days */
  .react-datePicker--day--inrange {
    background-color: ${({ theme }) => theme?.colors?.dateRangeSelection};
    color: ${({ theme }) => theme?.colors?.black};
  }
  .react-datepicker--day--hovered {
    background-color: ${({ theme }) => theme?.colors?.dateRangeSelection};
  }
  .react-datepicker--day--hovered-current {
    background-color: ${({ theme }) => theme?.colors?.grey['300']};
    color: ${({ theme }) => theme?.colors?.black};
    border-radius: 5px;
  }
  .react-datepicker__day--selected:focus {
    background-color: transparent;
    color: ${({ theme }) => theme?.colors?.black};
  }
  .react-datePicker--day--selected {
    ${primaryMixin}
  }

  .react-datepicker__day {
    margin: 0px;
    padding: 0px;
    width: auto;
    font-weight: 400;
  }
  .react-datePicker--day {
    cursor: pointer;
    // width: 3em;
    // height: 2.5em;
    width: 34px;
    height: 34px;
    line-height: normal;
    padding: 0.5em;
    font-size: 12px;
    color: ${({ theme }) => theme?.colors?.grey['800']};
  }
  .react-datepicker--day--selected-start {
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    ${primaryMixin}
  }
  .react-datePicker--day--selected-end {
    ${primaryMixin}
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .react-datepicker--day--selected-round {
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
  }
  /* main panel styles */
  .daterange--main-panel {
    border-right: ${({ theme }) => `1px solid ${theme?.colors?.grey['300']}`};
  }
  /* side panel styles */
  .daterange--side-panel {
    background-color: ${({ theme }) => theme?.colors?.grey['50']};
    display: flex;
    flex-direction: column;

    .predefined-date-range {
      padding-top: 15px;
      overflow-x: hidden;
      flex-grow: 1;
      width: 100%;
      // height: calc(100% - 18%);
      overflow: auto;
      label {
        display: block;
      }
      input[type='radio'] {
        display: none;
      }
      input[type='radio']:checked + .side-panel-label {
        ${primaryMixin}
      }
      .side-panel-label {
        cursor: pointer;
        padding: 7.5px 15px;
        color: ${({ theme }) => theme?.colors?.primary?.main};
        font-size: 13px;
        &:hover,
        &:active,
        &:focus {
          ${primaryMixin}
        }
      }
    }
  }
  /* style time */
  .react-datepicker__month-container {
    padding-bottom: 4em !important;
  }
  .react-datepicker__input-time-container {
    position: absolute;
    bottom: 1em;
    width: 50%;
    text-align: center;
    border-left: none;
  }

  .react-datepicker__day--disabled {
    cursor: default;
    color: #ccc;
    .react-datePicker--day {
      cursor: default;
      color: #ccc;
      pointer-events: none;
    }
  }
`

export const ButtonSetStyled = styled.div`
  bottom: 0px;
  display: flex;
  justify-content: space-evenly;
  margin: 15px;
  button {
    &:first-child {
      margin-right: 10px;
    }

    & span {
      font-size: 13px;
    }
  }
`

export const FontIconStyled = styled.div`
  padding: 11px;
  ${primaryMixin}
  vertical-align: middle;
  display: inline-block;
`

export const TextInputStyled = styled.div`
  display: flex;
  justify-content: space-evenly;
  & > div {
    width: 100%;
    margin: 0px 10px;

    & input {
      width: -webkit-fill-available;
    }
    & input.highlight-text-field-input,
    & input:focus {
      border: 1px solid ${({ theme }) => theme?.colors?.primary?.main};
      box-shadow: ${({ theme }) => `${theme?.shadows?.default}`};
      color: ${({ theme }) => theme?.colors?.primary?.main};
    }
    & input {
      margin: 18px 0px 10px 0px;
    }
  }
`
export const DateRangePickerContainer = styled.div`
  position: relative;
  display: block;
`
export const DateRangeStyled = styled.div`
  cursor: pointer;
  display: inline-flex;
  justify-content: start;
  position: relative;
  margin-top: 0px;
  height: 330px;
`

export const StyledCalendarDayButton = styled.button`
  padding: 0px;
  display: inline-block;
  background-color: transparent;
  border: none;
  box-shadow: none;

  &:focus {
    border: none;
    outline: none;
  }
`

export const TimeContainerStyled = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;

  & > div,
  & > span {
    margin: 0px 3px;
  }
  & > span {
    color: ${({ theme }) => theme?.colors?.grey?.A500};
    // margin-top: 5px;
  }
  & > div {
    color: ${({ theme }) => theme?.colors?.grey?.A700};
    &:last-child: {
      margin-left: 8px;
    }
  }
  /* & div[class$='IndicatorsContainer'] {
    display: none;
  } */
  & div[class$='control'] > div:first-child {
    justify-content: center;
    border: 1px solid ${({ theme }) => theme?.colors?.grey?.['500']};
    border-radius: 5px;
    padding: 0.2em 0px;
    height: 19px;
    & div[class$='singleValue'] {
      color: #777;
    }
  }
  & div[class$='menu'] {
    width: 40px;
    & div[class$='MenuList'] {
      max-height: 200px;
      & div[class$='option']:hover,
      & div[class$='option']:focus,
      & div[class$='option'].selected {
        background-color: ${({ theme }) => theme?.colors?.primary.main};
        color: white;
      }
    }
  }
`

export const IconColonStyled = styled.span`
  font-size: 14px;
`
