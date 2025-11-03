import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
    dark: true,
  },
  // gives a ts error, no idea why
  colorSchemeSelector: 'class',
});