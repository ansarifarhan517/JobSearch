import styled from 'styled-components'

export const AccordianContainer = styled.div`
  margin: 10px 0px;
  box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.38);

  .accordion__content__container {
    max-height: 0;
    height: 100%;
    transition: max-height 0.6s ease;
    overflow: auto;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .accordion__header__container {
    transition: background-color 0.3s ease-in;
    cursor: pointer;
    min-height: 40px;
    padding: 7px 15px;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;

    .accordion__header {
      flex-grow: 1;
    }

    .chevron {
      display: flex;
      align-items: center;
      transform: rotate(0deg);
      transition: transform 0.6s ease;
    }
    .toggleSwitch{
      .toggleSwitchLabel{
        input:checked + span{
          background: rgb(86 152 211 / 50%);
          box-shadow: inset 0px 0px 10px -5px #0000006e;
        }
        input:checked + span:before{
          background: #5698d3;
          box-shadow: 0px 0px 10px -3px #000;
        }
        span{
          background-color: rgba(34,31,31,0.26);
        }
        span:before{
          background: #f1f1f1;
          box-shadow: 0px 0px 10px -3px #000;
        }
      }
    }
    &.accordion__header__container_expanded{
      .toggleSwitch{
      .toggleSwitchLabel{
        input:checked + span{
          background-color: #9abfe3;
          box-shadow: inset 0px 0px 10px -5px #0000006e;
        }
        input:checked + span:before{
          background: #f1f1f1;
          box-shadow: 0px 0px 10px -3px #000;
        }
        span{
          background-color: #9d9fa3;
        }
        span:before{
          background: #f1f1f1;
          box-shadow: 0px 0px 10px -3px #000;
        }
      }
    }
    }
  }
 
`

export const AccordionHeaderTitle = styled.div.attrs((props) => ({
  className: `accordion-header-title ${props.className || ''}`
}))`
  padding-bottom: 3px;
  font-size: 14px;
  letter-spacing: 0.3px;
  line-height: 17px;
`

export const AccordionHeaderSubTitle = styled.div.attrs((props) => ({
  className: `accordion-header-sub-title ${props.className || ''}`
}))`
  font-size: 13px;
  opacity: 0.7;
  letter-spacing: 0.3px;
  margin-top: 2px;
  line-height: 17px;
`

export const AccordionContent = styled.div.attrs((props) => ({
  className: `accordion-content ${props.className || ''}`
}))`
  padding: 7px 15px;
  background-color: white;
`
