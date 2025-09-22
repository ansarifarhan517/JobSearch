import React from 'react'
import Tooltip from '../Tooltip'
import Box from '../../atoms/Box'
import Typography from '../../atoms/Typography'

export interface IErrorTooltipProps {
  message?: string;
  boundLeft?: number;
  isWordWrap: boolean;
}

const index = ({
  message = '',
  boundLeft,
  isWordWrap = false,
}: IErrorTooltipProps) => (
  <Tooltip
    hover
    tooltipDirection="top"
    arrowPlacement="center"
    messagePlacement="end"
    color={
      {
        arrow: 'error.main',
        border: 'error.main',
        background: 'error.light',
        text: 'error.main',
      }
    }
    message={message}
    boundLeft={boundLeft}
    isWordWrap={isWordWrap}
  >
    <Box
      borderRadius="50%"
      bgColor="error.main"
      color="error.contrastText"
      display="flex"
      alignItems="center"
      justifyContent="center"
      id="error-tooltip"
    >
      <Typography
        fontSize="11px"
        lineHeight="17px"
        align="center"
        width="17px"
      >
        !
      </Typography>
    </Box>
  </Tooltip>
)

export default index