import styled from 'styled-components'


interface IIconButtonProps {
    primary?: boolean
    menuIsOpen?: boolean
    width?: string
    disabled?: boolean
}

export const StyledSelectWrapper = styled.div<IIconButtonProps>`
  width: ${({ width }) => width};
  position: relative;
  .__react_component_tooltip {
    background-color: ${({ theme }) => theme?.colors?.primary?.main} !important;
    border-radius: 3px;
    font-size: 11px;
    opacity: 1 !important;
    font-family: Gotham-Rounded, Sans-Serif;
    font-weight: 400;
    border-color: ${({ theme }) => theme?.colors?.primary?.dark};
    word-break: break-word;
    max-width: 300px;
    width: max-content;
    padding: 10px;
    box-shadow: 0px 5px 25px -10px #000;
  }
`

export const IconDropdownDropdownStyled = styled.div`
  .menuAnimate {
    transform-origin: top;
  }
`