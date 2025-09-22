import React, { useState, useEffect } from 'react'
import ButtonGroupWrapper from './ButtonGroup.styled'
import FontIcon from '../../atoms/FontIcon'
import Box from '../../atoms/Box'
import ToolTip from '../../molecules/Tooltip'
import { IButtonGroup } from './interfaces'

const defaultFunction = () => {}
const ButtonGroup = ({
  data,
  onChange = defaultFunction,
  width = 'initial',
  height = '30px'
}: IButtonGroup) => {
  const [dataList, setDataList] = useState(data)

  // Refresh dataList whenever props change
  useEffect(() => {
    setDataList(data)
  }, [data])

  // Handle ButtonGroup Option Click
  const handleClick = (id: string) => {
    // Set Selected for dataItem & reset other dataItems
    const newList: any = Array.from(Object.create(dataList))
    newList.forEach((dataItem: any) => (dataItem.selected = id === dataItem.id))
    setDataList(newList)
    onChange(id)
  }

  return (
    <ButtonGroupWrapper>
      <ButtonGroupWrapper.ButtonGroups>
        {dataList.map(
          ({ label, id, selected, icon, tooltipText }, index: number) => {
            return (
              <React.Fragment key={id}>
                {tooltipText ? (
                  <ToolTip
                    message={tooltipText}
                    hover
                    arrowPlacement='center'
                    messagePlacement={
                      dataList.length - 1 === index ? 'end' : 'center'
                    }
                  >
                    <ButtonGroupWrapper
                      style={{
                        marginLeft: '-2px',
                        width: width,
                        height: height
                      }}
                      id={id}
                    >
                      <ButtonGroupWrapper.ButtonOption
                        selected={selected}
                        height={height}
                        // key={id}
                        onClick={() => handleClick(id)}
                      >
                        <Box horizontalSpacing='10px'>
                          {icon && <FontIcon icon={icon} size='sm' />}
                          <span
                            style={{
                              verticalAlign: 'middle',
                              fontSize: '13px'
                            }}
                          >
                            {label}
                          </span>
                        </Box>
                      </ButtonGroupWrapper.ButtonOption>
                    </ButtonGroupWrapper>
                  </ToolTip>
                ) : (
                  <ButtonGroupWrapper.ButtonOption
                    id={id}
                    height={height}
                    selected={selected}
                    // key={id}
                    onClick={() => handleClick(id)}
                    style={{ width: width, height: height }}
                  >
                    <Box horizontalSpacing='10px'>
                      {icon && <FontIcon icon={icon} size='sm' />}
                      <span>{label}</span>
                    </Box>
                  </ButtonGroupWrapper.ButtonOption>
                )}
              </React.Fragment>
            )
          }
        )}
      </ButtonGroupWrapper.ButtonGroups>
    </ButtonGroupWrapper>
  )
}

export default ButtonGroup

// < ButtonGroup options = { [{ id: '', label: '', selected: false }, {}]}
