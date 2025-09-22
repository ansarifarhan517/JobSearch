// import React from 'react'
import { mount } from '../../../../jest.setup'
import { DatePicker } from './index'
import React from 'react'

describe('Error Tooltip Component', () => {
  const wrapper = mount(
    <DatePicker
      label='Date of Birth'
      variant='date'
      dropdown
      className='DOB'
      error={false}
      disabled={false}
      required={false}
      errorMessage=''
    >
      {({ value, open, setOpen }) => {
        return (
          <button onClick={() => setOpen(!open)}>
            {value && value.toString()}
          </button>
        )
      }}
    </DatePicker>
  )
  it('should be Truthy', () => {
    expect(wrapper).toBeTruthy()
  })
  // date picker
  it('should open Datepicker on clicking the input', () => {})
  it('should not open when disabled', () => {})
  it('should be able to select days', () => {})
  it('should be change Dropdown values and change months and year', () => {})
  it('should be able to change months when clicked on right and left iconbutton', () => {})
  it('should be able to save the dates', () => {})
  it('should be able to edit value in Input Field', () => {})

  // date time picker
  it('should not select the disabled dates and times', () => {})
  it('should be able to change time intervals between time when assigned a dynamic value', () => {})
  it('should be able to change time Format', () => {})
  it('should not contain PM or AM in 24hour time format', () => {})
  it('should not contain more than 12 hours in timeformat of 12Hours', () => {})

  // date range picker
  it('should be able to select days start and end Date', () => {})
  it('should not select StartDate greater than End Date', () => {})
  it('should clear start date when selected Start date and then a smaller date than current Start Date', () => {})
  it('should not highlight when end date is invalid', () => {})
  it('should not allow apply changes when only one of the pair from start or end date is selected', () => {})
  it('should always have correct month displayed side to side', () => {})
  it('should be able to navigate through different months backward and forward', () => {})
  it('should be able to select hours, minutes and AM and PM, on selection proper values should be store and highlighted', () => {})
  it('should be able to not select AM and PM dropdown when selected 24 hours', () => {})
})
