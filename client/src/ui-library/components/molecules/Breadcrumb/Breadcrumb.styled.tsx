import styled from 'styled-components'
import Button from '../../atoms/Button'

interface IBreadCrumb {
  variant: string
}

export const BreadcrumbIconElement = styled.span`
  padding: 0px 10px;
`
export const BreadcrumbNameElement = styled.span`
  color: ${({ theme }) => theme?.colors?.black};
  cursor: not-allowed;
  font-size: 17px;
`
export const BreadcrumbDropdownElement = styled(Button)<IBreadCrumb>`
  color: ${({ theme }) => theme?.colors?.primary?.main};
  cursor: pointer;
  font-size: 17px;
  padding: 0px;
  &:hover {
    color: ${({ theme }) => theme?.colors?.primary?.main};
  }
`
export const BreadcrumbButtonElement = styled(Button)`
  color: ${({ theme }) => theme?.colors?.black};
  cursor: pointer;
  font-size: 17px;
  padding: 0px;
  &:hover {
    color: ${({ theme }) => theme?.colors?.black};
  }
`
export const BreadcrumbStyled = styled.span`
  display: inline-block;
`
export const BreadCrumbDropdownWrapper = styled.span`
  display: inline;
  & > div:nth-child(1) {
    height: 0px;
  }
`
