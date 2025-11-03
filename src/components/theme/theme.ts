import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
    dark: true,
  },
  colorSchemeSelector: 'class',
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});