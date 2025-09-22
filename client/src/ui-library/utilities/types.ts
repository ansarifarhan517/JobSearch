export type tPlacement = 'start' | 'center' | 'end'
export type tBreakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type tSizes = 'sm' | 'md' | 'lg'
export type tExtraSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type tDisplay =
  | 'block'
  | 'inline-block'
  | 'none'
  | 'flex'
  | 'inline-flex'

export type tFlexDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse'
export type tJustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-evenly'
  | 'center'
  | 'space-around'
export type tAlignItems = 'center' | 'flex-start' | 'flex-end' | 'stretch'
export interface IMarginProps {
  /** Margin */
  m?: string
  /** Margin Top */
  mt?: string
  /** Margin Bottom */
  mb?: string
  /** Margin Left */
  ml?: string
  /** Margin Right */
  mr?: string
  /** Margin Horizontally */
  mx?: string
  /** Margin Vertically */
  my?: string
}


export interface IPaddingProps {
  /** Padding */
  p?: string
  /** Padding Top */
  pt?: string
  /** Padding Bottom */
  pb?: string
  /** Padding Left */
  pl?: string
  /** Padding Right */
  pr?: string
  /** Padding Horizontally */
  px?: string
  /** Padding Vertically */
  py?: string
}

export interface IBorderProps {
  border?: number
  borderTop?: number
  borderBottom?: number
  borderRight?: number
  borderLeft?: number
  borderRadius?: string | number
  borderColor?: string
}

export interface IFlexProps {
  flexDirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
  justifyContent?:
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-evenly'
  | 'center'
  | 'space-around'
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  flexGrow?: number
  flexShrink?: number
}

export interface IColorProps {
  color?: string
}
export interface IBgColorProps {
  bgColor?: string
}

export interface ISpacingProps {
  horizontalSpacing?: number | string
  verticalSpacing?: number | string
}

export interface ISpacingPropsTypes {
  horizontalSpacing?: number | string
  verticalSpacing?: number | string
}

export interface ITheme {
  shadows: {
    default: string;
    hover: string;
    searchInput: string;
    toolTip: string;
    buttonPopupMenu: string;
    iconButtonPopover: string;
    hoverButtonPopover: string;
    toggleSwitch: string;
    toggleSwitchInner: string;
  };
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    up: (breakpoint: tBreakpoints) => string;
    down: (breakpoint: tBreakpoints) => string;
  };
  fontIcons: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  zIndex: {
    none: number;
    basic: number;
    loader: number;
    dropDown: number;
    max: number;
    mobileStepper: number;
    speedDial: number;
    appBar: number;
    drawer: number;
    toast: number;
    modal: number;
    popover: number;
    snackbar: number;
    tooltip: number;
    textFilter: number;
    listView: {
      pinnedColumn: number;
      columnHeader: number;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
    fontWeightBold: number;
  };
  scrollbar: {
    neutral: string;
    hover: string;
    active: string;
  };
  colors: {
    white: string;
    black: string;
    darkBlack: string;
    green: string;
    red: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      hint: string;
      inputLabel: {
        grey: string;
        default: string;
      };
    };
    listRowSelection: string;
    dateRangeSelection: string;
    popUpOverlay: string;
    lightPopUpOverlay: string;
    shiftTimingsBg: string;
    grey: {
      [key: string]: string | number;
      inputBorder: string;
      searchInputBorder: string;
    };
    charts: {
      green: string;
      red: string;
      brown: string;
      yellow: string;
      lightBlue: string;
      shadowBlue: string;
    };
    onlineStatus: {
      idle: string;
      offline: string;
    };
    primary: {
      main: string;
      contrastText: string;
      light: string;
      dark: string;
    };
    secondary: {
      main: string;
      contrastText: string;
    };
    error: {
      light: string;
      lighterMain: string;
      main: string;
      dark: string;
      contrastText: string;
      transparentLight: string;
      warning: string;
    };
    warning: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
    info: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
    success: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
  };
  modal: {
    sm: string;
    md: string;
    lg: string;
  };
}

