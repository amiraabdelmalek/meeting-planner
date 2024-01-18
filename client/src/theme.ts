import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#0EABBC',
      },
    },
    components: {
      MuiTabs: {
        styleOverrides: {
          root: {
            backgroundColor: '#202329',
            textTransform: 'none',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: '#fff',
            '&.Mui-selected': {
              color: '#0EABBC',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            textTransform: 'none',
          },
          contained: {
            color: '#fff',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: '#9D9FA4',
          },
        },
      },
    },
  },
  frFR,
);

export default theme;
