import styled from 'styled-components'
import { ISelectProps } from './interface'


interface IStyledDropDown {
    width: string
}

export const StyledDropDown = styled.div<IStyledDropDown>`
  width: ${({ width }) => width};

  .menuAnimate {
    transform-origin: top;
  }
`

export const ControlStyle = styled.div<ISelectProps>`
  padding-bottom: 3px;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1) 0 4px 11px hsla(0, 0%, 0% 0.1);
  background-color: white;
  padding-left: 15px;
  padding-right: 15px;
`

export const DescriptiveOption = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme?.colors?.grey['700']};
`

export const StyledDisabledlabel = styled.div`
  color: grey;
  cursor: disabled;
  opacity: 0.65 !important;
`
