import React from 'react'
import styled from 'styled-components'
import Button, { IButtonProps } from '../../atoms/Button'

// keeping it for further use
export interface IButtonListProps {
  listOfButtons: Array<IButtonProps>
 
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px;
`

const ButtonList = ({ listOfButtons }: IButtonListProps) => {
  return (
    <ButtonWrapper>
      {listOfButtons.map((button) => {
        return (
          <Button
            {...button}
            key={button.children}
            style={{ marginLeft: '13px' }}
          />
        )
      })}
    </ButtonWrapper>
  )
}

export default ButtonList
