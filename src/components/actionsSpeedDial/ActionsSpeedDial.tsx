import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

const actions = [
    {icon: <AspectRatioIcon/>, name: 'Edit'},
    {icon: <AddBoxIcon/>, name: 'Add'},
    {icon: <DeleteForeverIcon/>, name: 'Delete'},
];

export default function PlaygroundSpeedDial() {
    return (
        <Box>
        <StyledSpeedDial
                    ariaLabel="SpeedDial"
                    icon={<SpeedDialIcon />}
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