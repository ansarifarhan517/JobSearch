import React, { useState } from 'react'
import {
    SwitchStyled,
    SliderStyled,
    HiddenToggle,
    SwitchWapper,
    SwitchLabel
} from './Toggle.styled'
import { IToggleProps } from './interface'
import Position from '../Position'

const Toggle = React.forwardRef<HTMLInputElement, IToggleProps>(
    (
        {
            id,
            label,
            labelColor,
            checked,
            disabled = false,
            labelComponent,
            onChange = () => { },
            highlightWhenChecked = true,
            ...rest
        },
        ref
    ) => {
        const [isChecked, setIsChecked] = useState(checked)

        React.useEffect(() => {
            setIsChecked(checked)
        }, [checked])
        return (
            <Position type='relative' display='inline-block' className="toggleSwitch">
                <label htmlFor={id}>
                    <SwitchWapper disabled={disabled}>
                        <SwitchStyled htmlFor={id} className="toggleSwitchLabel">
                            <HiddenToggle
                                type='checkbox'
                                ref={ref}
                                id={id}
                                checked={isChecked}
                                disabled={disabled}
                                onChange={(e) => {
                                    setIsChecked(e.target.checked)
                                    onChange(e)
                                }}
                                highlightWhenChecked={highlightWhenChecked}
                                {...rest}
                            />
                            <SliderStyled />
                        </SwitchStyled>
                    </SwitchWapper>
                    {labelComponent ||
                        (label && (
                            <SwitchLabel
                                color={labelColor}
                                id={`${id}-label`}
                                disabled={disabled}
                            >
                                {label}
                            </SwitchLabel>
                        ))}
                </label>
            </Position>
        )
    }
)
export default Toggle
