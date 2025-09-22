import React, { useEffect } from 'react'
import styled from 'styled-components'

export interface ProgressBarDraggableProps {
  incompleteColor?: string
  completedColor?: string
  completedPercent?: number
  thickness?: number
  withDragThumb?: boolean
  ovalRadius: number
  borderThickness?: number
  notifySliderChange: (newPercent: number) => void
}
// All Numbers in pixels
export type ovalRadiusType = 2 | 5 | 10 | 15
export type thicknessType = 2 | 4 | 6 | 8 | 10

const SliderDraggable = styled.input<ProgressBarDraggableProps>`
  ${({ completedColor, completedPercent = 0, thickness = 6, theme, incompleteColor = "#e9edf0", 
  ovalRadius = 10 }) =>
    `
    background: linear-gradient(to right, ${completedColor?completedColor:theme?.colors?.primary?.main} 0%, ${completedColor?completedColor:theme?.colors?.primary?.main} ${completedPercent}%, ${incompleteColor} ${completedPercent}%, ${incompleteColor} 100%);
    border: solid 1px #82CFD0;
    border-radius: 2px;
    width: 100%;
    height: ${thickness}px;
    outline: none;
    opacity: 0.85;
    transition: background 150ms ease-in;
    transition: opacity 0.2s;
    -webkit-appearance: none;
    
    &::-webkit-slider-thumb {
      border: 3px solid ${completedColor?completedColor:theme?.colors?.primary?.main};
      border-radius: 50%;
      background-color: #fffff2;
      -webkit-appearance: none;
      appearance: none;
      width: ${ovalRadius*2}px;
      height: ${ovalRadius*2}px;
      cursor: pointer;
    }
    
  `}
`

const ProgressBarDraggable = ({
  incompleteColor = '#e9edf0',
  completedColor = '#5698d3',
  completedPercent = 0,
  thickness = 6,
  withDragThumb = true,
  notifySliderChange = () => {},
  ovalRadius = 8
}: Partial<ProgressBarDraggableProps>) => {
  const [progressPercent, setProgressPercent] = React.useState(completedPercent);

  useEffect(() => {
    setProgressPercent(completedPercent);
  }, [completedPercent])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sliderPercentNumber = parseInt(e.target.value)
    if (sliderPercentNumber) {
      setProgressPercent(sliderPercentNumber);
      if (sliderPercentNumber >= 0 && sliderPercentNumber <= 100) { //validation for component fixed ranges expected values
        notifySliderChange(sliderPercentNumber)
      }
    }
  };
  return (
    <SliderDraggable 
      thickness={thickness} 
      completedColor={completedColor}
      completedPercent={progressPercent}
      incompleteColor={incompleteColor}
      withDragThumb={withDragThumb}
      ovalRadius={ovalRadius}
      value={progressPercent}
      type="range"
      onChange={(e) => handleChange(e)}
      notifySliderChange={notifySliderChange}
    >
      
    </SliderDraggable>
  )

}

export default ProgressBarDraggable
