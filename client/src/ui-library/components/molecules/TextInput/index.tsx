import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { colorMixin } from '../../../utilities/components/mixins'
import FontIcon from '../../atoms/FontIcon'
import InputField, { type IInputFieldProps } from '../../atoms/InputField'
import ErrorTooltip from '../ErrorTooltip'
import InputLabel from '../InputLabels'
import Position from '../../atoms/Position'
import Tooltip from '../Tooltip'
import { faCalendar, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { type  SizeProp } from '@fortawesome/fontawesome-svg-core'

export type tTextInputVariant = 'basic' | 'withoutBorder' | 'textArea'
export interface ITextInputProps extends IInputFieldProps {
  id?: string
  className?: string
  label?: string
  labelColor?: string
  required?: boolean
  error?: boolean
  errorMessage?: string
  color?: string
  variant?: 'basic' | 'inline-edit' | 'withIcon' | 'textArea'
  iconVariant?: IconDefinition
  iconSize?: SizeProp
  iconStyle?: React.CSSProperties
  onIconClick?: ((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void) &
  ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void)
  border?: boolean
  contentEditable?: boolean
  value?: string | number;
  tooltipMesaage?: string
  tooltipDirection?: 'top' | 'bottom' | 'right' | 'left'
  arrowPlacement?: 'end' | 'start' | 'center'
  messagePlacement?: 'end' | 'start' | 'center'
  displayTootltipOnIcon?: boolean
  boundLeft?: number
  isChildNode?: boolean
  tooltipIsWordWrap?: boolean
}
interface ITextArea extends ITextInputProps {
  contentEditable: boolean
}

const shouldForwardProp = (prop: string) =>
  !['variant', 'error', 'border', 'label', 'fullWidth'].includes(prop)

export const InlineEditStyled = styled(InputField).withConfig({ shouldForwardProp }) <ITextInputProps>`
  ${({ variant, error }) =>
    variant === 'inline-edit' &&
    css`
      min-width: 100px;
      width: 100%;
      border: none;
      border-bottom: ${({ theme }) =>
    error
      ? `1px solid ${theme?.colors?.error?.dark}`
      : `1px solid ${theme?.colors?.primary?.main}`};
      background: ${({ theme }) =>
    error
      ? `${theme?.colors?.error?.transparentLight}`
      : `${theme?.colors?.white}`};
      min-height: 25px;
      padding: 0 5px;
      margin: 0px;

      &::placeholder {
        color: ${({ theme }) => `${theme?.colors?.grey['50']}`};
      }
    `}
`

export const FontIconStyled = styled.div.withConfig({ shouldForwardProp })<ITextInputProps>`
  background-color: ${({ theme }) => theme?.colors?.primary.main};
  color: ${({ theme }) => theme?.colors?.primary.contrastText};
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  ${({ border }) =>
    border &&
    css`
      border: 1px solid ${({ theme }) => theme?.colors?.primary.main};
    `}
`
const TextFieldStyled = styled(InlineEditStyled).withConfig({ shouldForwardProp }) <ITextInputProps>`
  border: ${({ border }) => !border && 'none'};
  ${({ variant, label }) =>
    variant === 'withIcon' &&
    css`
      margin: ${label === '' || label === undefined ? '0px' : '18px 0px'};
    `};
  ${colorMixin}
`

const TextAreaStyled = styled.div<ITextArea>`
  ${colorMixin}
  ${({ contentEditable }) => !contentEditable && 'opacity:0.5;'}
  border: 1px solid ${({ theme }) => `${theme?.colors?.grey?.['250']};`};
  font-size: 12px;
  letter-spacing: 0.3px;
  padding: 10px 10px;
  margin: 18px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  min-height: 40px;
  border-radius: 0;
  box-shadow: none;
  outline: none;
  &:focus {
    outline: none;
  }
  #textArea[placeholder]:empty:before {
    content: attr(placeholder);
    color: ${({ theme }) => theme?.colors?.grey?.['150']};
  }
`

const TextInput = React.forwardRef<HTMLInputElement, ITextInputProps>(
  (
    {
      label,
      labelColor,
      required,
      id,
      className,
      error,
      errorMessage,
      border = true,
      variant = 'basic',
      iconVariant,
      iconSize = 'sm',
      iconStyle,
      contentEditable,
      onIconClick,
      tooltipMesaage,
      fullWidth,
      tooltipDirection,
      arrowPlacement,
      messagePlacement,
      displayTootltipOnIcon = false,
      boundLeft,
      isChildNode = false,
      tooltipIsWordWrap = false,
      ...rest
    },
    ref,
  ) => {
    const [_contentEditable, setContentEditable] = useState(contentEditable)
    useEffect(() => {
      setContentEditable(contentEditable)
    }, [contentEditable])
    return (
      <Position
        type="relative"
        fullWidth={fullWidth}
        display={variant === 'withIcon' ? 'flex' : 'block'}
        alignItems="stretch"

      >
        {variant === 'textArea' ? (
          <TextAreaStyled
            id="textArea"
            contentEditable={!!_contentEditable}

            onKeyUp={(e: any) => rest?.onChange && rest?.onChange(e)}
            suppressContentEditableWarning
            className={`${className}-input`}
            placeholder="Insert text here ..."
            onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => rest?.onBlur && rest.onBlur(e)}
          >
            {rest?.value}
          </TextAreaStyled>
        ) : (
          <TextFieldStyled
            type="text"
            {...rest}
            ref={ref}
            id={`${id}-input`}
            className={`${className}-input`}
            error={error}
            variant={variant}
            border={border}
            label={label}
            fullWidth={fullWidth}
          />
        )}
        {variant !== 'inline-edit' && (
          <Position
            type="absolute"
            top={variant === 'textArea' ? '-5px' : '10px'}
            left="10px"
            style={{ maxWidth: 'calc(100% - 20px)' }}
          >
            {displayTootltipOnIcon ? (
              <InputLabel
                required={required}
                color={labelColor}
                id={`${id}-label`}
                className={`${className}-label`}
              >
                {label}
              </InputLabel>
            ) : (
              <Tooltip
                message={tooltipMesaage}
                hover
                hide={!tooltipMesaage}
                arrowPlacement={arrowPlacement ?? 'center'}
                messagePlacement={messagePlacement ?? 'center'}
                tooltipDirection={tooltipDirection ?? 'bottom'}
                isWordWrap={tooltipIsWordWrap}
              >
                <InputLabel
                  required={required}
                  color={labelColor}
                  isChildNode={isChildNode}
                  id={`${id}-label`}
                  className={`${className}-label`}
                >
                  {label}
                </InputLabel>
              </Tooltip>
            )}
          </Position>
        )}
        {variant !== 'inline-edit' && error && errorMessage && (
          <Position
            type="absolute"
            top={label === '' || label === undefined ? '-7.5px' : '9.5px'}
            right={`${variant === 'withIcon' ? '-9.5px' : '-28.5px'}`}
            style={{ zIndex: 1 }}
          >
            <ErrorTooltip message={errorMessage} boundLeft={boundLeft} isWordWrap={true} />
          </Position>
        )}
        {variant === 'withIcon' && (
          <div style={{ minHeight: '40px' }}>
            {displayTootltipOnIcon ? (
              <Tooltip
                message={tooltipMesaage}
                hover
                hide={!tooltipMesaage}
                arrowPlacement={arrowPlacement || 'center'}
                messagePlacement={messagePlacement || 'center'}
                tooltipDirection={tooltipDirection || 'bottom'}
              >
                <FontIconStyled
                  style={{
                    ...(label
                      ? {
                        margin: '18px 0px 0',
                        minHeight: '40px',
                        height: 'auto',
                      }
                      : {
                        margin: '0px',
                        minHeight: '40px',
                        height: 'auto',
                      }),
                    ...iconStyle,
                  }}
                  border={border}
                  onClick={onIconClick}
                >
                  <FontIcon
                    icon={iconVariant || faCalendar}
                    color="white"
                    size={iconSize}
                  />
                </FontIconStyled>
              </Tooltip>
            ) : (
              <FontIconStyled
                style={{
                  ...(label
                    ? {
                      margin: '18px 0px 0',
                      minHeight: '40px',
                      height: 'auto',
                    }
                    : {
                      margin: '0px',
                      minHeight: '40px',
                      height: 'auto',
                    }),
                  ...iconStyle,
                }}
                border={border}
                onClick={onIconClick}
              >
                <FontIcon
                  icon={iconVariant || faCalendar}
                  color="white"
                  size={iconSize}
                />
              </FontIconStyled>
            )}
          </div>
        )}
      </Position>
    )
  },
)

export default TextInput
