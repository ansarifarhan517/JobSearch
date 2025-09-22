const BreadCrumbStyled = (width: string, theme: any) => ({
  control: (provided: any) => ({
    ...provided,
    borderStyle: 'none',
    borderRadius: '0px',
    boxShadow: 'none',
    backgroundColor: theme?.colors?.grey['50'],
    fontSize: '17px',
    width: '0px',
    '&:focus': {
      borderStyle: 'none',
      boxShadow: 'none',
    },
    '&:hover': {
      borderStyle: 'none',
      boxShadow: 'none',
      border: 'none',
      // borderColor: theme?.colors?.grey['A800']
    },
    '&:before': {
      boxShadow: 'none',
      border: 'none',
      borderStyle: 'none',
    },
  }),
  option: (provided: any) => ({
    ...provided,
    // backgroundColor: state?.isSelected ? theme?.colors?.primary?.main : null,
    padding: '10px 15px',
    '&:hover': {
      backgroundColor: theme?.colors?.grey['50'],
      color: theme?.colors?.primary?.main,
    },
    fontSize: '13px',
    color: theme?.colors?.grey['150'],
    zIndex: 1500,
    cursor: 'pointer',
    '.favourite-icon': {
      color: theme?.colors?.secondary?.main,
    },
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    zIndex: 100,
    backgroundColor: state?.isSelected
      ? theme?.colors?.primary?.main
      : theme?.colors?.white,
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: state?.isSelected
        ? theme?.colors?.primary?.main
        : theme?.colors?.white,
    },
    boxShadow: '0 4px 11px hsla(0,0%,0%,0.1)',
    marginTop: '-14px',
    minWidth: '160px',
    border: 'none',
    width,
    // removed a small arrow
    // '&::before': {
    //   position: 'absolute',
    //   zIndex: 1000,
    //   content: '""',
    //   right: '45%',
    //   top: '-8px',
    //   //  borderWidth: ' 0 10px 10px 10px',
    //   transitionDuration: '0.3s',
    //   transitionProperty: 'transform',
    //   borderLeft: '8px solid transparent',
    //   borderRight: '8px solid transparent',
    //   borderBottom: '8px solid rgb(225, 230, 239)'
    // }
  }),
  menuList: (provided: any) => ({
    ...provided,
    marginTop: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
  }),

  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: theme?.colors?.primary?.main,
    fontSize: '10px',
    cursor: 'pointer',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0px',
    marginBottom: '-3px',
    backgroundColor: 'transparent',
    color: 'transparent',
  }),
})

export default BreadCrumbStyled
