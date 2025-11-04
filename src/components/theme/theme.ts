import { createTheme } from "@mui/material/styles";


export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
    dark: true,
  },
  // it says this doesn't exist, but it does ??, removing it breaks the theme button
  // @ts-ignore
  colorSchemeSelector: 'class',
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});