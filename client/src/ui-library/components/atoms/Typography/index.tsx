import React from 'react'
import styled from 'styled-components'
// import PropTypes from 'prop-types'
import type {
  IColorProps,
  IBgColorProps,
} from '../../../utilities/types'
import { colorMixin, bgColorMixin } from '../../../utilities/components/mixins'

type whiteSpacePropertyType =
  | 'normal'
  | 'pre'
  | 'nowrap'
  | 'pre-wrap'
  | 'pre-line'
  | 'break-spaces'
export interface ITypographyProps
  extends IColorProps,
  IBgColorProps,
  React.HTMLAttributes<HTMLDivElement> {
  variant?: 'inputLabel' | 'errorMessage' | 'tooltip' | 'tooltipWithWordWrap'
  align?: 'left' | 'right' | 'center'
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
  fontWeight?: number
  bold?: boolean
  italic?: boolean
  underline?: boolean
  primary?: boolean
  useStyle?: boolean
  width?: string
}

// List of props to filter out from being passed to the HTML div
const shouldForwardProp = (prop: string) =>
  ![
    'fontSize',
    'fontWeight',
    'width',
    'underline',
    'align',
    'bold',
    'italic',
    'lineHeight',
    'primary',
    'useStyle',
    'variant',
    'bgColor',
  ].includes(prop)


const TypographyStyled = styled.div.withConfig({ shouldForwardProp })<ITypographyProps>`
  width: ${({ width }) => width && width};
  font-size: ${({ fontSize, theme }) =>
    fontSize || `${theme?.typography?.fontSize}px`};
  text-decoration: ${({ underline }) => underline && 'underline'};
  text-align: ${({ align }) => align};
  font-weight: ${({ bold }) => (bold ? 'bold' : undefined)};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-style: ${({ italic }) => (italic ? 'oblique' : undefined)};
  line-height: ${({ lineHeight }) => lineHeight};
  color: ${({ primary, theme }) => (primary ? theme?.colors?.primary?.main : undefined)};
  ${colorMixin};
  ${bgColorMixin};
`

const TypographyVariantsPropsMapping = {
  inputLabel: {},
  errorMessage: {
    fontSize: '11px',
    color: 'error.main',
  },
  tooltip: {
    fontSize: '11px',
  },
  tooltipWithWordWrap: {
    fontSize: '11px',
  },
}
const Typography = ({
  children,
  variant,
  useStyle = true,
  ...props
}: ITypographyProps) => {
  const newProps = variant
    ? {
      ...props,
      ...TypographyVariantsPropsMapping[variant],
    }
    : { ...props }
  const whiteSpaceValue: whiteSpacePropertyType =
    variant === 'tooltipWithWordWrap' ? 'normal' : 'nowrap'

  return (
    <TypographyStyled
      {...newProps}
      style={
        useStyle
          ? {
            whiteSpace: whiteSpaceValue,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }
          : {}
      }
    >
      {children}
    </TypographyStyled>
  )
}



// Typography.propTypes = typographyPropTypes

export default Typography
