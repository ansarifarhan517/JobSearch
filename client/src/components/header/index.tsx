import React from 'react'
import styled from 'styled-components'
import { Button } from '../../ui-library/components/atoms'

interface IHeaderProps extends React.HTMLAttributes<HTMLElement> {
    children?: any
}



const Header = () => {

    const HeaderStyled = styled.header<IHeaderProps>`
        width: 100%;
        height: 8%;
        background-color: ${({ theme }) => theme?.colors?.primary?.main};
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;    
        box-sizing: border-box;
        box-shadow: ${({ theme }) => theme?.shadows?.default};
        z-index: 1000;

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 150px;

            svg {
                width: 100%;
                height: 100%;
            }
        }
    `

    return (
        <HeaderStyled>
            <div className="logo">
                <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="80" r="20" fill="#1E90FF" stroke="#333333" stroke-width="2" />
                    <circle cx="140" cy="80" r="20" fill="#1E90FF" stroke="#333333" stroke-width="2" />
                    <line x1="80" y1="80" x2="120" y2="80" stroke="#333333" stroke-width="4" />
                    <circle cx="140" cy="140" r="20" fill="#1E90FF" stroke="#333333" stroke-width="2" />
                    <line x1="140" y1="100" x2="140" y2="120" stroke="#333333" stroke-width="4" />
                </svg>
            </div>
            
        </HeaderStyled>
    )
}

export default Header