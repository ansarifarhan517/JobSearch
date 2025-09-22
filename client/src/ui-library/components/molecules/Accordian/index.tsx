import React from 'react'
import { IAccordianProps } from './interface'
import { AccordianContainer } from './Accordian.styled'
import Box from '../../atoms/Box'
import FontIcon from '../../atoms/FontIcon'
import Toggle from '../../atoms/Toggle'
import Tooltip from '../Tooltip'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
const defaultCallback = () => {}
const Accordion = ({
  id,
  expanded = false,
  onToggle = defaultCallback,
  hideChevron = false,
  children: { header, content },
  showToggleSwitch = false,
  onToggleSwitch,
  isToggleChecked = false,
  switchTooltipMessage,
  switchTooltipProps = {},
  toggleSwitchStyle={},
  toggleSwitchDisable= false
}: IAccordianProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = React.useState<number | string>(0)
  const [contentHeight, setContentHeight] = React.useState<number>(0)

  React.useEffect(() => {
    if (expanded) {
      setMaxHeight(contentHeight || 0)
      setMaxHeight('inherit')
    } else {
      setMaxHeight(contentHeight || 0)
      setMaxHeight(0)
    }
  }, [expanded])

  React.useEffect(() => {
    setContentHeight(contentRef.current?.scrollHeight || 0)
  }, [content])

  React.useEffect(() => {
    if (expanded) {
      setMaxHeight(contentHeight || 0)
      setMaxHeight('inherit')
    }
  }, [contentHeight])

  const handleClick = () => {
    onToggle(id, !expanded)
  }

  return (
    <AccordianContainer id={`accordion-${id}`} className='accordian__container'>
      <Box
        display='flex'
        bgColor={expanded ? 'primary.main' : 'grey.200'}
        color={expanded ? 'white' : 'inherit'}
        className={'accordion__header__container '+ ( expanded? ' accordion__header__container_expanded':'') }
        style={hideChevron ? { cursor: 'unset' } : {}}
        onClick={ !showToggleSwitch ?  handleClick : undefined }
      >
        <div className='accordion__header' onClick={showToggleSwitch ?  handleClick : undefined }>{header}</div>
        {showToggleSwitch && (
          <Box ml='10px' fullHeight  style={toggleSwitchStyle}>
            <Tooltip
              message={switchTooltipMessage}
              hover
              hide={!switchTooltipMessage}
              {...switchTooltipProps}
            >
            <Toggle 
              id={`toggle-${id}`}
              checked={isToggleChecked}
              onChange={(_e) => { onToggleSwitch && onToggleSwitch(_e?.target?.checked)}
              }
              disabled={toggleSwitchDisable}
            />
            </Tooltip>
          </Box>
        )}
        {!hideChevron && (
          <Box
            ml='10px'
            fullHeight
            className='chevron'
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
            onClick={showToggleSwitch ?  handleClick : undefined }
          >
            <FontIcon icon={faAngleDown} />
          </Box>
        )}
      </Box>
      <div
        style={{
          maxHeight,
          overflow: expanded ? 'visible' : 'auto'
        }}
        className='accordion__content__container'
      >
        <div ref={contentRef}>{content}</div>
      </div>
    </AccordianContainer>
  )
}

export default Accordion
