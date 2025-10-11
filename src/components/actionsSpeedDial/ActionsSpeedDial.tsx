import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import type { JSX } from 'react';

export interface Action {
  icon: JSX.Element;
  name: string;
}

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

interface ActionsSpeedDialProps {
  actions: Action[];
  onAction?: (name: string) => void;
}

export default function ActionsSpeedDial({ actions, onAction }: ActionsSpeedDialProps) {
  const handleClick = (name: string) => {
    if (onAction) onAction(name);
  };

  return (
    <Box>
      <StyledSpeedDial ariaLabel="SpeedDial" icon={<SpeedDialIcon />} direction="up">
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={() => handleClick(action.name)}
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