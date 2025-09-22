import React, { ReactNode } from 'react'
import {
    RadioContainer,
    StyledRadio,
    RadioLabel,
    RadioWrapper,
    Icon,
    HiddenRadio
} from './Radio.styled'

const radioSizeMapping = {
    sm: 13,
    md: 15,
    lg: 18
}
export type tRadioSize = 'sm' | 'md' | 'lg' | number
export interface IRadioProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    // extends React.DetailedHTMLProps< //   React.InputHTMLAttributes<HTMLInputElement>, //   HTMLInputElement // >
    radioSize?: tRadioSize
    label?: string
    labelColor?: string
    labelComponent?: ReactNode
    fontWeight?: string
}

const Radio = React.forwardRef<HTMLInputElement, IRadioProps>(
    (
        {
            id,
            disabled = false,
            radioSize = 'sm',
            fontWeight,
            // checked = false,
            // defaultChecked = false,
            label = '',
            labelColor,
            // value,
            // name,
            // onChange = () => {},
            labelComponent,
            ...rest
        },
        ref
    ) => {
        // const [isChecked, setIsChecked] = useState(defaultChecked || checked)
        // useEffect(() => {
        //   setIsChecked(checked)
        // }, [checked])
        return (
            <RadioWrapper id={id + '-RadioWrapper'} disabled={disabled} htmlFor={id}>
                <RadioContainer
                    style={{
                        width: radioSizeMapping[radioSize as keyof typeof radioSizeMapping] || 15,
                        height: radioSizeMapping[radioSize as keyof typeof radioSizeMapping] || 15,
                    }}
                >
                    <HiddenRadio
                        type='radio'
                        id={id}
                        disabled={disabled}
                        // checked={isChecked}
                        // name={name}
                        // value={value}
                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        //   e.target && setIsChecked(e.target.checked)
                        //   onChange(e)
                        // }}
                        ref={ref}
                        {...rest}
                    />
                    <StyledRadio
                        disabled={disabled}
                        radioSize={
                            radioSize && typeof radioSize === 'number'
                                ? radioSize
                                : radioSizeMapping[radioSize as keyof typeof radioSizeMapping]
                        }
                    >
                        <Icon viewBox='0 0 20 20'>
                            <circle
                                cx='10'
                                cy='10'
                                r='8'
                                stroke='primary.contrastText'
                                strokeWidth='3'
                                fill='primary.main'
                            // style={{ paddingBottom: '4px' }}
                            />
                        </Icon>
                    </StyledRadio>
                </RadioContainer>
                {labelComponent ||
                    (label && (
                        <RadioLabel fontWeight={fontWeight} htmlFor={id} color={labelColor}>
                            {label}
                        </RadioLabel>
                    ))}
            </RadioWrapper>
        )
    }
)

export default Radio
