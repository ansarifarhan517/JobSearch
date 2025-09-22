import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import FontIcon from '../../atoms/FontIcon'
import type { IToastProps } from './interface'
import IconButton from '../../atoms/IconButton'
import { faCheckCircle, faClose } from '@fortawesome/free-solid-svg-icons'

const ToastStyled = styled.div`
  font-size: 13px;
  width: 100%;
  font-weight: 500;
  max-width: 400px;
  max-height: auto;
  padding: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: ${({ theme }) => `${theme?.typography?.fontSize}`};
  font-family: ${({ theme }) => `${theme?.typography?.fontFamily}`};
  background-color: ${({ theme }) => `${theme?.colors?.primary?.main}`};
  box-shadow: ${({ theme }) => `${theme?.shadows?.default}`};
  color: ${({ theme }) => `${theme?.colors?.primary?.contrastText}`};
  i {
    font-size: ${({ theme }) => `${theme?.fontIcons?.xs}px`};
    margin: 3px 7px 0px 7px;
  }
  .message {
    margin: 0px 7px;
    font-weight: 500;
  }
  margin: 10px auto;
  z-index: ${({ theme }) => `${theme?.zIndex?.toast}`};
`
const IconButtonStyled = styled(IconButton)`
  background-color: transparent;
  padding: 0px;
  position: absolute;
  top: auto;
  right: 0px;
`

/* custom timer function to implement start and pause */

const CustomTimer = (callback: any, delay: number) => {
    let id: NodeJS.Timeout
    let started: Date
    let remaining: number = delay
    const start = () => {
        started = new Date()
        id = setTimeout(callback, remaining)
    }
    const pause = () => {
        clearTimeout(id)
        const temp = new Date()
        remaining -= temp.valueOf() - started.valueOf()
    }
    start()
    return { start, pause }
}

const Toast = ({
    children,
    remove,
    iconVariant = faCheckCircle,
    removeButton
}: IToastProps) => {
    const removeRef = useRef<HTMLElement | any>()
    removeRef.current = remove
    const [classname, setClassname] = useState('')
    const [timerState, setTimerState] = useState({
        start: () => { },
        pause: () => { }
    })

    const handlePause = () => {
        timerState.pause && timerState.pause()
    }
    const handleResume = () => {
        timerState.start && timerState.start()
    }
    const startTimer = (): any => {
        return classname !== ''
            ? setTimeout(() => {
                /* removes the toast from the list */
                removeRef.current && removeRef.current()
            }, 500)
            : CustomTimer(() => {
                /* Adds a class that fades out the Toast */
                setClassname('removing')
            }, 4000)
    }

    useEffect(() => {
        setTimerState(() => startTimer())
    }, [classname])

    return (
        <ToastStyled
            className={classname + ' Toast'}
            onMouseOver={handlePause}
            onMouseLeave={handleResume}
        >
            <FontIcon icon={iconVariant} color='white' size='sm' />
            <div className='message'>{children}</div>
            {removeButton && (
                <IconButtonStyled
                    intent='default'
                    iconVariant={faClose}
                    children='Close'
                    onClick={remove}
                    iconSize='xs'
                    onlyIcon
                    color='primary.contrastText'
                />
            )}
        </ToastStyled>
    )
}

export default Toast
