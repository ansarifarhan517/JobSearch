import React from 'react'
import styled, { keyframes } from 'styled-components'

export type tLoaderSpeed = 1 | 2 | 3 | 4 | 5
export interface LoaderProps {
    center?: boolean
    fadeBackground?: boolean
    /* 1 | 2 | 3 | 4 | 5 */
    speed?: tLoaderSpeed
}

const bounce = keyframes`
  0%, 100%, 80% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`

const Container = styled.div<LoaderProps>`
  ${({ center, theme }) =>
        center &&
        `
    position: absolute;
    top: 0;
    left: 5px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items:center;
    justify-content: center;
    z-index: ${theme?.zIndex?.loader};
    
  `}

  ${({ fadeBackground }) =>
        fadeBackground &&
        `
    
    background-color: rgba(255,255,255,.5);
  `}
`

type ElementProps = {
    delay: number
    speed: number
}
interface ISpeedMapping {
    [key: number]: number
}
const speedMapping: ISpeedMapping = {
    1: 1,
    2: 1.2,
    3: 1.3,
    4: 1.4,
    5: 1.5
}
const Element = styled.div<ElementProps>`
  margin: 0 5px;
  width: 15px;
  height: 15px;
  background-color: #5698d3;
  border-radius: 50%;
  display: inline-block;
  -webkit-animation: ${bounce} ${({ speed }) => 1.4 / speedMapping[speed as keyof ISpeedMapping]}s
    infinite ease-in-out both;
  animation: ${bounce} ${({ speed }) => 1.4 / speedMapping[speed]}s infinite
    ease-in-out both;
  -webkit-animation-delay: ${({ delay }) => delay}s;
  animation-delay: ${({ delay }) => delay}s;
`

const ElementAnimationDelays = [-0.32, -0.16, 0]

const Loader = ({
    center = false,
    fadeBackground = false,
    speed = 1
}: LoaderProps) => (
    <Container center={center} fadeBackground={fadeBackground}>
        {ElementAnimationDelays.map((delay, index) => (
            <Element
                delay={delay}
                key={index}
                speed={speed}
                className='loader-element'
            />
        ))}
    </Container>
)

export default Loader
