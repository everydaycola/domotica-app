import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type {Room} from "../../model/room.ts";
import {GeneralContext} from "../../context/GeneralContext.ts";
import {useContext} from "react";

export type RoomsListProps = {
  rooms: Room[] | undefined;
  selectedRoomId: number | null;
  onSelectRoom: (room: Room) => void;
  onAddRoom: () => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (room: Room) => void;
  clearRoomSelection: () => void;
  selectedRoomName?: string | null;
};

export default function RoomsList({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  clearRoomSelection,
  selectedRoomName,
}: Readonly<RoomsListProps>) {
  const { isAdmin } = useContext(GeneralContext);

  return (
    <Box sx={{ flex: 1, minWidth: 280 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">Rooms</Typography>
          {selectedRoomName && (
            <Chip color="primary" size="small" label={`Selected: ${selectedRoomName}`} />
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          {selectedRoomId !== null && (
            <Button size="small" onClick={clearRoomSelection}>Clear selection</Button>
          )}
          {isAdmin &&
            (<Button variant="contained" size="small" startIcon={<AddIcon/>} onClick={onAddRoom}>Add room</Button>)
          }
        </Stack>
      </Stack>
      <Divider />
      <List>
        {rooms && rooms.length > 0 ? rooms.map((room) => (
          <ListItem
            key={room.id}
            component="div"
            disableGutters
            secondaryAction={isAdmin &&
              <>
                <IconButton edge="end" aria-label="edit" onClick={(e) => { e.stopPropagation(); onEditRoom(room); }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); onDeleteRoom(room); }} sx={{ ml: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemButton
              selected={selectedRoomId === room.id}
              onClick={() => onSelectRoom(room)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': { bgcolor: 'action.selected', borderLeft: '4px solid', borderLeftColor: 'primary.main' },
                '&.Mui-selected:hover': { bgcolor: 'action.selected' },
              }}
            >
              <ListItemText
                primary={room.name}
                secondary={`x:${room.xMm} y:${room.yMm} • ${room.widthMm}x${room.heightMm} mm${room.description ? ' • ' + room.description : ''}`}
              />
            </ListItemButton>
          </ListItem>
        )) : (
          <ListItem component="div">
            <ListItemText primary="No rooms yet" />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
