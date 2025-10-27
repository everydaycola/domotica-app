import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {ThemeButton} from '../theme/ThemeButton';
import {useContext} from "react";
import {GeneralContext} from "../../context/GeneralContext.ts";


export default function CustomAppBar() {

  const {floorNumber} = useContext(GeneralContext)

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{flexGrow: 1, textAlign: 'center'}}
          >
            Verdieping {floorNumber}
          </Typography>
          <div>
            <ThemeButton/>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
