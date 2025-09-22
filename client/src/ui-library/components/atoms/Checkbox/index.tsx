import React from 'react'
import {
    CheckboxContainer,
    CheckBoxLabel,
    CheckBoxWrapper,
    HiddenCheckbox,
    Icon,
    StyledCheckbox
} from './Checkbox.Styled'

interface ICheckBoxSizeMapping {
    sm: number,
    md: number,
    lg: number
}

const checkboxSizeMapping: ICheckBoxSizeMapping = {
    sm: 13,
    md: 15,
    lg: 18
}
export type tCheckboxSize = 'sm' | 'md' | 'lg' | number
export interface ICheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    // extends React.DetailedHTMLProps< //   React.InputHTMLAttributes<HTMLInputElement>, //   HTMLInputElement // >
    checkboxSize?: tCheckboxSize
    label?: string
    labelColor?: string
    labelComponent?: React.ReactNode
    color?: string
    disabledVariant?: 'transparent' | 'greyed'
    customStyle?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, ICheckboxProps>(
    (
        {
            id,
            disabled = false,
            checkboxSize = 'sm',
            checked = false,
            label = '',
            labelColor,
            labelComponent,
            color,
            disabledVariant = 'transparent',
            onChange = () => { },
            customStyle,
            ...rest
        },
        ref
    ) => {
        const [isChecked, setIsChecked] = React.useState<boolean>(checked)

        React.useEffect(() => {
            setIsChecked(checked)
        }, [checked])
        return (
            <CheckBoxWrapper
                id={id + '-CheckboxWrapper'}
                disabled={disabled}
                disabledVariant={disabledVariant}
            >
                <CheckboxContainer>
                    <StyledCheckbox
                        id={id + '-StyledCheckbox'}
                        disabled={disabled}
                        checkboxSize={
                            checkboxSize && typeof checkboxSize === 'number'
                                ? checkboxSize
                                : checkboxSizeMapping[checkboxSize  as keyof ICheckBoxSizeMapping]
                        }
                        checked={isChecked}
                        color={color}
                        disabledVariant={disabledVariant}
                        customStyle={customStyle}
                    >
                        <HiddenCheckbox
                            type='checkbox'
                            id={id}
                            disabled={disabled}
                            checked={checked}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setIsChecked((c) => !c)
                                onChange(e)
                            }}
                            checkboxSize={
                                checkboxSize && typeof checkboxSize === 'number'
                                    ? checkboxSize
                                    : checkboxSizeMapping[checkboxSize as keyof ICheckBoxSizeMapping]
                            }
                            ref={ref}
                            {...rest}
                        />
                        <Icon viewBox='0 0 24 24'>
                            <polyline points='20 6 9 17 4 12' />
                        </Icon>
                    </StyledCheckbox>
                </CheckboxContainer>
                {labelComponent ||
                    (label && (
                        <CheckBoxLabel color={labelColor} htmlFor={id}>
                            {label}
                        </CheckBoxLabel>
                    ))}
            </CheckBoxWrapper>
        )
    }
)
export default Checkbox
