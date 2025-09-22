import styled from 'styled-components'
import { IToggleProps, IToggleStyle } from './interface'
import Position from '../Position'

export const ToggleStyled = styled.span`
  display: inline-block;
`
export const SwitchWapper = styled.div<IToggleStyle>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};
`
export const SwitchLabel = styled(Position)<IToggleStyle>`
  position: relative;
  display: inline-block;
  margin: 0px 5px;
  opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};
`
export const SliderStyled = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme?.colors?.grey['500']};
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 30px;
  box-shadow: ${({ theme }) =>
    `${theme?.shadows?.toggleSwitchInner} ${theme?.colors?.black}`};

  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: -5px;
    bottom: -1.66px;
    background-color: ${({ theme }) => theme?.colors?.grey['50']};
    -webkit-transition: 0.4s;
    transition: 0.5s;
    border-radius: 50%;
    box-shadow: ${({ theme }) => `${theme?.shadows?.toggleSwitch} #7d7d7dbf`};
  }
`
export const SwitchStyled = styled.label`
  position: relative;
  display: inline-block;
  width: 35px;
  height: 14px;
  margin: 4px 5px 4px 5px;
`

export const HiddenToggle = styled.input<IToggleProps>`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${SliderStyled} {
    ${({ theme, highlightWhenChecked }) =>
      highlightWhenChecked &&
      `background-color:  ${theme?.colors?.primary?.light};`}

    &:before {
      transform: translateX(26px);
      ${({ theme, highlightWhenChecked }) =>
        highlightWhenChecked &&
        `background-color:  ${theme?.colors?.primary?.main};`}
    }
  }
`
