import React, { useEffect, useRef, useState } from 'react'
import FontIcon from '../../atoms/FontIcon'
import IconDropdown from '../IconDropdown'
import Position from '../../atoms/Position'
import Tooltip from '../Tooltip'

import {
  BreadcrumbButtonElement,
  BreadcrumbDropdownElement,
  BreadcrumbIconElement,
  BreadcrumbNameElement,
  BreadcrumbStyled,
  BreadCrumbDropdownWrapper,
} from './Breadcrumb.styled'
import { IBreadcrumbProps } from './interface'
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Breadcrumb = ({
  options,
  onClick = () => { },
  optionList,
  width,
  onSetAsFavourite,
  variant,
}: IBreadcrumbProps) => {
  const [linkLabel, setLinkLabel] = useState<string | undefined>(undefined)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const node = useRef(null)

  // close
  const handleOutsideClick = (e: any) => {
    const n = (node.current as unknown) as Node
    if (n?.contains(e.target)) return
    setIsMenuOpen(false)
  }

  const getDropdownLabel = (title: string) => {
    let dropdownLabel = ''
    optionList?.forEach((option: any) => {
      if (option?.options?.length) {
        option.options.forEach((subOpt: any) => {
          if (subOpt.value === title) {
            dropdownLabel = `${option.label} - ${subOpt.label}`
          }
        })
      } else {
        if (option.value === title) {
          dropdownLabel = option.label
        }
      }
    })
    return dropdownLabel
  }

  useEffect(() => {
    optionList && document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      optionList &&
        document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  // if breadcrumb is a link then make it dropdown.whenever click outside close it
  return (
    <Position type="relative" display="inline-block">
      {options.map(({ id, label, toolTipMessage, disabled = true }, index) => {
        const option = optionList?.find((option: any) => option?.id === id)
        return (
          <BreadcrumbStyled key={id}>
            {disabled ? (
              <BreadcrumbNameElement>{label}</BreadcrumbNameElement>
            ) : optionList ? (
              <BreadCrumbDropdownWrapper
                ref={node}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {variant === 'multilevel' ? (
                  <IconDropdown
                    variant="multilevel-breadcrumb"
                    optionList={optionList || []}
                    onChange={(value: any) => {
                      setIsMenuOpen(false)
                      setLinkLabel(value)
                      onClick(value)
                    }}
                    value={linkLabel || option?.value}
                    menuIsOpen={isMenuOpen}
                  />
                ) : (
                  <IconDropdown
                    variant="bread-crumb"
                    optionList={optionList || []}
                    onChange={(value: any) => {
                      setIsMenuOpen(false)
                      setLinkLabel(value)
                      onClick(value)
                    }}
                    value={linkLabel || option?.value}
                    menuIsOpen={isMenuOpen}
                    width={width}
                    onSetAsFavourite={onSetAsFavourite}
                  />
                )}

                <Tooltip
                  message={toolTipMessage}
                  hide={isMenuOpen || !toolTipMessage}
                  hover={!isMenuOpen}
                >
                  <BreadcrumbDropdownElement variant="link" id="label">
                    {(linkLabel && getDropdownLabel(linkLabel)) || label}
                    <span style={{
                      marginTop: '11px',
                      marginLeft: '8px',
                    }}>
                      <FontIcon
                        size={'sm'}
                        color="primary.main"
                        icon={faAngleDown}
                        hoverColor="primary.main"
                      />
                    </span>
                  </BreadcrumbDropdownElement>
                </Tooltip>
              </BreadCrumbDropdownWrapper>
            ) : (
              <BreadcrumbButtonElement
                onClick={() => onClick(id)}
                variant="link"
              >
                {label}
              </BreadcrumbButtonElement>
            )}

            {options.length - 1 > index && (
              <BreadcrumbIconElement>
                <FontIcon
                  icon={faAngleRight}
                  color="grey.A200"
                  size={'sm'}
                />
              </BreadcrumbIconElement>
            )}
          </BreadcrumbStyled>
        )
      })}
    </Position>
  )
}

export default Breadcrumb