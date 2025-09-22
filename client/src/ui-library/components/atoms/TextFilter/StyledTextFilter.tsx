import styled from 'styled-components'
interface StyledTextFilter {
  width: string
}
export const StyledTextFilter = styled.div`
  cursor: pointer;
  display: flex;
`
export const StyledInput = styled.input<StyledTextFilter>`
  text-overflow: ellipsis;
  width: ${({ width }) => width};
  padding-left:17px;
  padding-right: 17px;
  padding-bottom: 5px;
  border: none;
  font-size: 12px;
  border-bottom: ${({ theme }) => `1px solid ${theme?.colors?.grey['400']}`};
  &:hover {
    outline:0;
    border: none;
    border-bottom: ${({ theme }) => `1px solid ${theme?.colors?.grey['400']}`};
  }
  &:focus {
    outline:0;
    border: none;
    border-bottom: ${({ theme }) => `1px solid ${theme?.colors?.grey['400']}`};
  }
  input[type=text] {
    border: none;
    border-bottom: ${({ theme }) => `1px solid ${theme?.colors?.grey['400']}`};
  }
`

export const SyledSearch = styled.div`
  z-index: ${({ theme }) => theme?.zIndex?.basic};
  margin-right: -13px;
`

export const StyledCross = styled.div`
  margin-left: -14px;
  z-index: ${({ theme }) => theme?.zIndex?.basic};
`
