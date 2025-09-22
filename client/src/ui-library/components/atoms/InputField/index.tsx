import React from 'react'
import style from 'styled-components'


export interface IInputFieldProps extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement> {
    fullWidth?: boolean
    error?: boolean
}

const InputField = style.input<IInputFieldProps>`
    width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
    border: 1px solid
    ${({ theme, error }) =>
    error ? theme?.colors?.error?.main : theme?.colors?.grey['A800']};
    font-size: 12px;
    letter-spacing: 0.3px;
    padding: 0 10px;
    margin: 18px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    min-height: 40px;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    &:focus {
     outline: none;
    }

`




export default InputField