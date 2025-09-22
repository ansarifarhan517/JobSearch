import styled from 'styled-components'
import { IRadioProps } from '.'
import { colorMixin } from '../../../utilities/components/mixins'

export const Icon = styled.svg`
  fill: none;
  stroke: ${({ theme }) => theme?.colors?.primary.contrastText};
  stroke-width: 2px;
  visibility: hidden;
`
export const HiddenRadio = styled.input<IRadioProps>`
  border: 0;
  margin: 0px;
  padding: 0;
  position: absolute;
  cursor: pointer;
  opacity: 0;
`

export const StyledRadio = styled.span<IRadioProps>`
  border-radius: 50%;
  display: inline-block;
  width: ${({ radioSize }) => `${radioSize}px`};
  height: ${({ radioSize }) => `${radioSize}px`};
  border: ${({ theme }) => `1px solid ${theme?.colors?.grey?.A800}`};
  background-color: ${({ theme }) => theme?.colors?.primary?.white};
`

export const RadioLabel = styled.label<IRadioProps>`
  cursor: pointer;
  margin: 0px 5px;
  display: flex;
  align-self: center;
  color: inherit;
  ${colorMixin};
  font-size: 13px;
  padding-left:5px;
  font-weight: ${({ fontWeight }) => ((fontWeight ? `${fontWeight}` : `normal`) + `!important`)};
  transition: all 150ms;
  justify-content: center;
  display: flex;
  vertical-align: middle;
`

export const RadioContainer = styled.span`
  display: inline-block;
  vertical-align: middle;

  ${HiddenRadio}:hover + & {
    box-shadow: ${({ theme }) =>
        `inset 0 0px 5px 1px ${theme?.shadows?.radiochecked}`};
  }
  input[type='radio']:checked + ${StyledRadio} {
    background-color: ${({ theme }) => theme?.colors?.primary?.main};
    border: ${({ theme }) => `1px solid ${theme?.colors?.primary?.light}`};
  }
  input[type='radio']:checked + ${StyledRadio} {
    ${Icon} {
      vertical-align: top;
      visibility: visible;
    }
  }
`
export const RadioWrapper = styled.label<IRadioProps>`
  display: flex;
  vertical-align: middle;
  ${({ disabled }) => (disabled ? 'opacity: 0.3' : 'opacity: 1')};
`
