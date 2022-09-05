import React from 'react';
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FFC500',
      main: '#19AF66',
      dark: '#DD2222',
      contrastText: '#3E323F',
    },
    secondary: {
      light: '#8C0082',
      main: '#720096',
      dark: '#5B0078',
      contrastText: '#3E323F',
    },
  },
  typography: {
    h1: {
      fontWeight: 600,
      fontSize: "4rem",
      lineHeight: "4.5rem",
      letterSpacing: "0px"
    },
    h2: {
      fontWeight: 500,
      fontSize: "2.625rem",
      lineHeight: "3.5rem",
      letterSpacing: "0px"
    },
    h3: {
      fontWeight: 500,
      fontSize: "2rem",
      lineHeight: "2.5rem",
      letterSpacing: "0px"
    },
    h4: {
      fontWeight: 400,
      fontSize: "1.5rem",
      lineHeight: "2rem",
      letterSpacing: "0px"
    },
    h5: {
      fontWeight: 400,
      fontSize: "1.25rem",
      lineHeight: "1.5rem",
      letterSpacing: "0px"
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      letterSpacing: "0px"
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
          <Header/>
          <Home></Home>
    </ThemeProvider>
  );
}

export default App;
