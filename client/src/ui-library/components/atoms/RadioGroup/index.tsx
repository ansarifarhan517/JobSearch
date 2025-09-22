import React, { useState } from 'react'
import { RadioGroupStyled } from './RadioGroup.styled'
import ErrorTooltip from '../../molecules/ErrorTooltip'
import Position from '../Position'
import InputLabel from '@ui-library/components/molecules/InputLabels'

export interface IRadioGroupProps {
    id: string
    orientation?: boolean
    spacing?: number | string
    width?: string
    variant?: 'default' | 'form'
    className?: string
    label?: string
    labelColor?: string
    required?: boolean
    error?: boolean
    errorMessage?: string
    children?: any
}

const RadioGroup = ({
    id,
    orientation = false,
    spacing = '',
    width = '100%',
    variant = 'default',
    label,
    labelColor,
    error,
    errorMessage,
    required,
    children,
    className,
    ...rest
}: IRadioGroupProps) => {
    const [direction, setDirection] = useState(orientation)
    React.useEffect(() => {
        setDirection(orientation)
    }, [orientation])
    const spacingProps = spacing
        ? {
            [direction ? 'verticalSpacing' : 'horizontalSpacing']: spacing
        }
        : {}
    return (
        <Position type='relative' display='block'>
            <RadioGroupStyled
                orientation={direction}
                variant={variant}
                error={error}
                id={id}
                width={width}
                {...rest}
                {...spacingProps}
            >
                {variant === 'form' && (
                    <Position
                        type='absolute'
                        top='-9px'
                        left='8px'
                        style={{ maxWidth: 'calc(100% - 20px)' }}
                    >
                        <InputLabel
                            required={required}
                            color={labelColor}
                            id={`${id}-label`}
                            className={`${className}-label`}
                        >
                            {label}
                        </InputLabel>
                    </Position>
                )}
                {variant === 'form' && error && errorMessage && (
                    <Position type='absolute' top='-9px' right='-7px'>
                        <ErrorTooltip message={errorMessage} isWordWrap={false} />
                    </Position>
                )}
                {children}
            </RadioGroupStyled>
        </Position>
    )
}
export default RadioGroup
