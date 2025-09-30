import React, { useCallback } from 'react'
import styled from 'styled-components'
import FontIcon from '../../ui-library/components/atoms/FontIcon';
import { faArrowLeft, faArrowRight, faGrip, faHome, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface ISidebarProps extends React.HTMLAttributes<HTMLElement> { 
    sidebarData?: sidebarItem[];
}

interface sidebarItem {
    label: string;
    icon?: IconDefinition;
    link: string;
}

const Sidebar = ({ sidebarData = [{ label: 'Home', icon: faHome, link: '/home' }, { label: 'Dashboard', icon: faGrip, link: '/dashboard' }] }: ISidebarProps) => {

    const [isOpen, setIsOpen] = React.useState(true);
    const SidebarStyled = styled.div`
        position: relative;
        width: ${isOpen ? '250px' : '30px'};
        height: 100%;
        background-color: ${({ theme }) => theme?.colors?.secondary?.light};
        padding: 1rem;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        

        animation: slideIn 0.3s forwards;

        @keyframes slideIn {
            from {
                transform: translateX(-100%);
            }
            to {
                transform: translateX(0);
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
            }
            to {
                transform: translateX(-100%);
            }
        }

        &.slide-out {
            animation: slideOut 0.3s forwards;
        }       

        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: ${ isOpen ? 'space-between' : 'center'};
            margin-bottom: 2rem;
            cursor: pointer;
            
            &:hover {
                opacity: 0.8;
            }
        
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: ${({ theme }) => theme?.colors?.primary?.dark};

        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                padding: 10px 0;
                border-bottom: 1px solid ${({ theme }) => theme?.colors?.grey?.light};
                cursor: pointer;

                &:hover {
                    background-color: ${({ theme }) => theme?.colors?.grey?.lighter};
                }
            }
            
            .sidebar-icon {
                margin: 10px 0;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background-color: ${({ theme }) => theme?.colors?.grey?.lighter};
                }
            }
        }

        .sidebar-footer {
            position: absolute;
            bottom: 1rem;
            width: 100%;
            text-align: center;
            font-size: 0.8rem;
            color: ${({ theme }) => theme?.colors?.grey?.dark};
        }

    `;

    const SideBarToggleHandler = useCallback(
      () => {
        setIsOpen((prev) => !prev);
      },
      [],
    )

    return (
        <SidebarStyled>
            <div className='sidebar-header'>
                {isOpen && <p>Job Search Automation</p>}
                <FontIcon icon={faArrowLeft} onClick={SideBarToggleHandler} />
            </div>
            <ul>
                {sidebarData?.map((item, index) => {
                    return isOpen ? <Link to={item.link}><li key={index}>{item.label}</li></Link> :
                    <div className='sidebar-icon'>
                        <Link to={item.link}>
                            <FontIcon icon={item.icon ?? faArrowRight} size="lg" />
                        </Link> 
                    </div>;
                })}
            </ul>
            <div className='sidebar-footer'>
                {isOpen && <p>&copy; 2024 Job Search Automation</p>}
            </div>
        </SidebarStyled>
    )
}

export default Sidebar