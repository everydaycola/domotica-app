import { createTheme } from "@mui/material/styles";

// Enable CSS variables and color schemes (light/dark)
export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
    dark: true,
  },
  // Use a manual selector so setMode() works; options: 'class' or 'data'
  colorSchemeSelector: 'class',
  // You can customize typography, palette, etc. here later.
});