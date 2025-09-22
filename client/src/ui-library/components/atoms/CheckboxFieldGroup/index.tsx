import React from 'react'
import { CheckboxFieldGroupStyled } from './CheckboxFieldGroup.styled'
import ErrorTooltip from '../../molecules/ErrorTooltip'
import Position from '../Position'
import InputLabel from '@ui-library/components/molecules/InputLabels'
export interface ICheckboxFieldGroupProps
    extends React.HTMLAttributes<HTMLInputElement> {
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
    horizontalSpacing?: number | string
    verticalSpacing?: number | string

}

const CheckboxFieldGroup = React.forwardRef<
    HTMLDivElement,
    ICheckboxFieldGroupProps
>(
    (
        {
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
        }: ICheckboxFieldGroupProps,
        ref
    ) => {
        const spacingProps = spacing
            ? {
                [orientation ? 'verticalSpacing' : 'horizontalSpacing']: spacing
            }
            : {}

        return (
            <Position type='relative' display='block'>
                <CheckboxFieldGroupStyled
                    orientation={orientation}
                    variant={variant}
                    width={width}
                    error={error}
                    id={id}
                    ref={ref}
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
                        <Position type='absolute' top='-8px' right='-8px'>
                            <ErrorTooltip message={errorMessage} isWordWrap={false} />
                        </Position>
                    )}
                    {children}
                </CheckboxFieldGroupStyled>
            </Position>
        )
    }
)
export default CheckboxFieldGroup
