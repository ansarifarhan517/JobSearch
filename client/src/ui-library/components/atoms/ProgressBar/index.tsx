import React from 'react'
import styled from 'styled-components'
import Typography from '../Typography'

export interface ProgressBarProps {
    incompleteColor?: string
    completedColor?: string
    completedPercent?: number
    thickness?: number
    borderThickness?: number
    labelText?: string
    labelFontSize?: string
    labelFontColor?: string
    labelFontWeight?: number
}
// All Numbers in pixels
export type ovalRadiusType = 2 | 5 | 10 | 15
export type thicknessType = 2 | 4 | 6 | 8 | 10

const ProgressSlider = styled.div<ProgressBarProps>`
  ${({ completedColor, completedPercent = 0, thickness = 6, theme, incompleteColor = "#e9edf0" }) =>
        `
    background: linear-gradient(to right, ${completedColor ? completedColor : theme?.colors?.primary?.main} 0%, ${completedColor ? completedColor : theme?.colors?.primary?.main} ${completedPercent}%, ${incompleteColor} ${completedPercent}%, ${incompleteColor} 100%);
    border-radius: 2px;
    width: 100%;
    height: ${thickness}px;
    outline: none;
    transition: background 450ms ease-in;
    -webkit-appearance: none;
    
  `}
`


const ProgressBar = ({
    incompleteColor = '#e9edf0',
    completedColor = '#5698d3',
    completedPercent = 40,
    thickness = 6,
    labelText = '',
    labelFontSize = '11px',
    labelFontColor = 'black',
    labelFontWeight = 500
}: Partial<ProgressBarProps>) => (
    <div>
        {labelText && labelText.trim() !== "" &&
            <Typography
                useStyle={false}
                fontSize={labelFontSize}
                fontWeight={labelFontWeight}
                color={labelFontColor}
            >
                {labelText}
            </Typography>}
        <ProgressSlider
            thickness={thickness}
            completedColor={completedColor}
            completedPercent={completedPercent}
            incompleteColor={incompleteColor}
            labelText={labelText}
        >
        </ProgressSlider>

    </div>

)

export default ProgressBar
