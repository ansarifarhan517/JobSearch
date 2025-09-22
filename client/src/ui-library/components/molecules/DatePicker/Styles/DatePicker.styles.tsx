import styled, { css } from 'styled-components'

export const primaryMixin = css`
  background-color: ${({ theme }) => theme?.colors?.primary.main};
  color: ${({ theme }) => theme?.colors?.primary.contrastText};
`
export const DatePickerStyled = styled.div<
  React.HTMLAttributes<HTMLDivElement>
>`
  display: inline-flex;
  position: absolute;
  top: auto;
  left: auto;

  ${({ theme }) =>
    theme &&
    css`
      .react-datepicker-wrapper {
        display: unset;
      }
      .react-datepicker {
        display: inline-flex;
        border: none;
        box-shadow: ${theme?.shadows?.default};
        border-radius: 0px;
        // font-family: ${theme?.typography?.fontFamily};
        font-family: inherit;
        font-size: 12px;
      }
      .react-datepicker-popper[data-placement^='bottom'] {
        margin-top: -15px;
      }
      .react-datepicker {
        .react-datepicker__triangle {
          display: none;
        }
      }
      .react-datepicker__header {
        border-bottom: none;
        background-color: ${theme?.colors?.primary?.contrastText};
      }
      .react-datepicker__day:hover {
        border-radius: 0px;
      }
      .react-datepicker__day--selected,
      .react-datepicker__day--keyboard-selected,
      .react-datepicker__day--selected:focus,
      .react-datepicker__day:focus {
        ${primaryMixin}
        border-radius: 0px;
        outline: none;
        font-weight: ${theme?.typography?.fontWeightRegular};
      }
      .react-datepicker__day--disabled:focus {
        background-color: ${theme?.colors?.primary?.contrastText};
        color: ${theme?.colors?.grey['500']};
      }
      .react-datepicker__time-container
        .react-datepicker__time
        .react-datepicker__time-box
        ul.react-datepicker__time-list
        li.react-datepicker__time-list-item {
        line-height: 30px;
        vertical-align: middle;
        color: ${theme?.colors?.grey['700']};
        border-bottom: 0.5px solid ${theme?.colors?.grey['300']};
      }
      .react-datepicker__time-container
        .react-datepicker__time
        .react-datepicker__time-box
        ul.react-datepicker__time-list
        li.react-datepicker__time-list-item--selected {
        font-weight: ${theme?.typography?.fontWeightRegular};
        ${primaryMixin}
      }
      .react-datepicker__day-name,
      .react-datepicker__day,
      .react-datepicker__time-name {
        margin: 0px;
        width: 34px;
        line-height: 34px;
        font-size: inherit;
        font-family: inherit;
        font-weight: ${theme?.typography?.fontWeightRegular};
      }
      .react-datepicker__time-name {
        color: ${theme?.colors?.grey?.A200};
      }

      .react-datepicker__day--outside-month {
        // visibility: hidden;
        color: rgba(102, 102, 102, 0.7);
      }
      .react-datepicker__input-time-container {
        width: auto;
        margin: 0px;
        border-left: 1px solid ${theme?.colors?.grey['300']};
        .react-datepicker-time__caption {
          display: none;
        }
        .react-datepicker-time__input {
          margin: 0px;
        }
        button {
          padding: 1em 1.3em;
          height: 33px;
        }
      }

      // highlight home date

      .react-datepicker__day--homeDate {
        background-color: ${({ theme }) => theme?.colors?.primary?.main};
        color: ${theme?.colors?.primary?.contrastText};
      }
    `}
`

export const TimeContainerStyled = styled.div`
  text-align: center;
`

export const TimeContainerScrollabelStyled = styled.div`
  display: block;
  height: 195px;
  overflow-y: scroll;
  border-top: 1px solid ${({ theme }) => theme?.colors.grey['300']};
  border-bottom: 1px solid ${({ theme }) => theme?.colors.grey['300']};
`

export const TimeTabStyled = styled.div`
  display: block;
  padding: 1em 2em;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.grey['300']};

  &:hover,
  &:focus,
  &.selected-time {
    ${primaryMixin}
  }
  &:active {
    background-color: ${({ theme }) => theme?.colors?.primary?.dark};
  }
`

export const CustomHeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  select {
    border: none;
  }
`
export const FontIconStyled = styled.div`
  margin: 18px 0px;
  padding: 12px 11px 11px 11px;
  ${primaryMixin}
  vertical-align: middle;
  display: inline-block;
`
export const TextInputStyled = styled.div`
  display: flex;
  & > div:first-child {
    width: 100%;
  }
`
export const DatePickerWrapper = styled.div`
  position: relative;
  display: block;
  .datepickerWithDays{
        background: #fff;
        box-shadow: 0 2px 11px -5px #000;
        .react-datepicker--time-only{
      box-shadow: none;
    }
        .daterange--side-panel {
    background-color: ${({ theme }) => theme?.colors?.white['50']};
    display: flex;
    flex-direction: column;
    .predefined-date-range {
      padding-top: 15px;
      overflow-x: hidden;
      flex-grow: 1;
      width: 240px;
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
      .counter-label{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 15px;
      input{
        text-align: center;
        width:30px;
        height: 18px;
        padding: 0;
        margin: 0;
        border: 1px solid #ccc;
        color:#000;
      }
      .counter{
        margin: 5px;
        cursor: pointer;
      }
      .days{
        margin-left: 10px;
      }
    }
    }
   
  }
}
`

export const ButtonSetStyled = styled.div`
  bottom: 0px;
  display: flex;
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
