import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {ThemeButton} from '../theme/ThemeButton';
import {useContext} from "react";
import {GeneralContext} from "../../context/GeneralContext.ts";
import {FormControlLabel, Switch} from "@mui/material";

export interface AppBarProps {
  title: string;
}

export function CustomAppBar({title}: Readonly<AppBarProps>) {

  const {isAdmin, setIsAdmin} = useContext(GeneralContext)

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{flexGrow: 1, textAlign: 'center'}}
          >
            {title}
          </Typography>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <FormControlLabel
              control={<Switch color="default" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
              label={isAdmin ? 'Admin' : 'User'}
            />
            <ThemeButton/>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
