import { Box, IconButton } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { DarkMode, LightMode, SettingsBrightness } from "@mui/icons-material";

export function ThemeButton() {
  const {mode, setMode} = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 5,
      }}
    >
      <IconButton
        onClick={() => {
          if (mode === 'light') setMode('dark');
          else if (mode === 'dark') setMode('system');
          else setMode('light');
        }}
        color="inherit"
        aria-label="toggle theme"
      >
        {mode === 'light' && <LightMode/>}
        {mode === 'dark' && <DarkMode/>}
        {mode === 'system' && <SettingsBrightness/>}
      </IconButton>
    </Box>
  );
}
