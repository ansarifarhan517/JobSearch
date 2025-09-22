import styled, { ThemeContext } from 'styled-components'
import { useContext } from 'react'
import { tMultiSelectWrapperProps } from './interfaces'
import { CheckBoxWrapper } from '../../atoms/Checkbox/Checkbox.Styled'

export const MultiSelectStyled = styled.div<tMultiSelectWrapperProps>`
  display: block;
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  width: ${({ width }) => width};
`
export const CustomStyles = () => {
  const theme = useContext(ThemeContext)
  return {
    container: (provided: any) => ({
      ...provided,
      position: 'relative',
      display: 'block',
      backgroundColor: theme?.colors?.primary?.contrastText,
      zIndex: theme?.zIndex?.dropDown
    }),
    menu: (provided: any) => ({
      ...provided,
      margin: '0px',
      border: 'none',
      boxShadow: 'none',
      position: 'relative'
    }),
    multiValue: (provided: any) => ({
      ...provided,
      display: 'none'
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '0px',
      border: state.isFocus || state.isHover ? 'none' : 'none',
      borderColor: state.isFocus || state.isHover ? 'white' : 'white',
      boxShadow: state.isFocus || state.isHover ? 'none' : 'none',
      borderBottom: `1px solid ${theme?.colors?.grey?.A800}`,
      margin: '0em 12px'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      marginLeft: '26px',
      cursor: 'pointer'
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      fontSize: '13px',
      padding: '11px 15px',
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : state?.isFocused
        ? theme?.colors?.grey['50']
        : 'inherit',
      color: state?.isSelected
        ? theme?.colors?.primary?.contrastText
        : state.isFocused
        ? theme?.colors?.primary?.main
        : 'inherit',
      cursor: 'pointer',
      ':active': {
        ...provided[':active'],
        backgroundColor: state?.isSelected
          ? theme?.colors?.primary?.main
          : theme?.colors?.grey['50'],
        color: state?.isSelected
          ? theme?.colors?.primary?.contrastText
          : theme?.colors?.primary?.main
      },
      '& label': {
        cursor: 'pointer'
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      cursor: 'pointer',
      padding: '8px 0px'
    }),
    NoOptionsMessage: (base: any) => ({ ...base })
  }
}

export const StyledCheckBoxlabel = styled.label`
  margin: 0px 0.5em;
`
export const InputStyled = styled.span`
  margin: 0px 0 0 9px;
  width: 80%;

  .multiselect-serach-input {
    width: 100%;
    cursor: pointer;

    input {
      width: 100%;
      cursor: pointer;
    }
  }
`
export const OptionCheckboxStyled = styled.div`
  ${CheckBoxWrapper} {
    display: inline-flex;
  }
  cursor: pointer;
`

export const StyledDisabledlabel = styled.div`
  margin: 0px 0.5em;
  color: grey;
  cursor: disabled;
  border: 1px solid red;
`
