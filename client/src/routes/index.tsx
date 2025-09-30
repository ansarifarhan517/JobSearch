import React, { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'


const Home = lazy(() => import('../pages/home'))
const Dashboard = lazy(() => import('../pages/dashboard'))

const StyledPageContainer = styled.div`
  overflow-x: hidden;
  border-top: 1px solid ${({ theme }) => theme?.colors?.grey['A800']};
`


const PageContainer = () => (
    <StyledPageContainer>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Navigate replace to="home" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="home" element={<Home />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </Suspense>
    </StyledPageContainer>
)
export default PageContainer