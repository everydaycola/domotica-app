import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import type {action} from "../../pages/Verdieping.tsx";

const StyledSpeedDial = styled(SpeedDial)(({theme}) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

interface ActionsSpeedDialProps {
    actions: action[]
}

export default function ActionsSpeedDial({actions}: ActionsSpeedDialProps) {
    return (
        <Box>
            <StyledSpeedDial
                ariaLabel="SpeedDial"
                icon={<SpeedDialIcon/>}
                direction="up"
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        slotProps={{
                            tooltip: {
                                open: true,
                                title: action.name,
                            },
                        }}
                    />
                ))}
            </StyledSpeedDial>
        </Box>
    );
}