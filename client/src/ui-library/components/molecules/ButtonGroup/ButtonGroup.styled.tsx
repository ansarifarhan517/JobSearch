import styled from 'styled-components'
import { IButtonGroupOption } from './interfaces'

const ButtonOption = styled.span<IButtonGroupOption>`
  text-align: center;
  color: ${({ theme, selected }) =>
    selected
      ? theme?.colors?.primary?.contrastText
      : theme?.colors?.primary?.main};
  font-size: 12px;
  padding: 0 10px;
  cursor: pointer;
  border-left: ${({ theme, selected }) =>
    `1px solid ${
      selected ? theme?.colors?.primary?.main : theme?.colors?.text?.disabled
    }`};
  background-color: ${({ theme, selected }) =>
    selected ? theme?.colors?.primary?.main : theme?.colors?.white};
  &:after {
    content: '';
    clear: both;
    display: table;
  }
  transition: all 0.2s ease-out;
  line-height: ${({ height }) => (height ? height : '30px')};
  height: ${({ height }) => (height ? height : '30px')};
`

const ButtonGroups: any = styled.div`
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  margin: 0 5px;
  display: flex;
  &:nth-child(2) {
    border-left: none;
  }
`
const ButtonGroupWrapper: any = styled.div`
  display: flex;
`
ButtonGroupWrapper.ButtonOption = ButtonOption
ButtonGroupWrapper.ButtonGroups = ButtonGroups

export default ButtonGroupWrapper
