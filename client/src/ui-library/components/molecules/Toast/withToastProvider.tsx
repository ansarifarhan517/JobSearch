import React, { useState } from 'react'
// import { createPortal } from 'react-dom'
import Toast from './Toast'
import ToastContext from './context'
import styled, { keyframes } from 'styled-components'
import type { IWithToastProvider, tRemoveProps } from './interface'
import useDebounce from '../../../utilities/useDebounce'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'

const { createPortal } = await import('react-dom');
const ToastKeyframes = (fade: string) => keyframes`
  0% {
      opacity: ${fade === 'in' ? '0' : '1'};
      top:${fade === 'in' ? '-100px' : '0px'};
    }
    50% {
      opacity: ${fade === 'in' ? '1' : '0'};
      top:${fade === 'in' ? '0px' : 'auto'};
    }
`
const ToastWrapperStyled = styled.div`
  display: table-row;
  justify-content: center;
  position: fixed;
  z-index: ${({ theme }) => `${theme?.zIndex?.toast}`};
  width: 100%;
  top: 67px;
  .Toast {
    position: relative;
    animation: 0.5s ${ToastKeyframes('in')} ease-in;
  }
  .Toast.removing {
    position: relative;
    animation: 0.5s ${ToastKeyframes('out')} ease-in;
    opacity: 0;
  }
`
// Create a random ID
const generateUEID = () => {
  const first: number = (Math.random() * 46656) | 0
  const second: number = (Math.random() * 46656) | 0
  return (
    ('000' + first.toString(36)).slice(-3) +
    ('000' + second.toString(36)).slice(-3)
  )
}

const withToastProvider = <P extends object>(
  Component: React.ComponentType<P>,
  elementId: string = ''
) => {
  const WithToastProvider = (props: any) => {
    const [toasts, setToasts] = useState<IWithToastProvider[]>([])
    const debouncedValue = useDebounce(toasts, 500)

    // add toast to the array
    const add = (
      content: string,
      iconVariant: IconDefinition,
      removeButton: boolean
    ) => {
      const toastId = generateUEID()
      setToasts([
        // ...toasts,
        { toastId, content, iconVariant, removeButton }
      ] as IWithToastProvider[])
      return toastId
    }

    // remove toast from the array
    const remove = (toastId: tRemoveProps) =>
      setToasts(toasts.filter((t: IWithToastProvider) => t.toastId !== toastId))

    return (
      <ToastContext.Provider value={{ add, remove }}>
        <Component {...props} />

        {createPortal(
          <ToastWrapperStyled>
            {debouncedValue.map(
              ({ toastId, content, ...props }: IWithToastProvider) => (
                <Toast key={toastId} remove={() => remove(toastId)} {...props}>
                  {content}
                </Toast>
              )
            )}
          </ToastWrapperStyled>,
          document.getElementById(elementId) || document.body
        )}
      </ToastContext.Provider>
    )
  }
  return WithToastProvider
}

export default withToastProvider
