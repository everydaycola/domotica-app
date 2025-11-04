import {
  Box,
  Button,
  Divider,
  IconButton, InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack, TextField
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type {Room, Floor} from "../../model";
import {GeneralContext} from "../../context/GeneralContext.ts";
import {useContext, useState} from "react";
import {RoomDialog} from "../dialogs/room";
import {DeleteConfirmDialog} from "../dialogs/DeleteConfirmDialog.tsx";
import {useCreateRoom, useDeleteRoom, useUpdateRoom, useRoomFiltered} from "../../hooks";
import SearchIcon from "@mui/icons-material/Search";

export type RoomsListProps = {
  floor: Floor,
  rooms: Room[] | undefined;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
};

export function RoomsList({
                            floor,
                            rooms,
                            selectedRoom,
                            setSelectedRoom,
                          }: Readonly<RoomsListProps>) {
  const {isAdmin} = useContext(GeneralContext);

  const [openRoomAdd, setOpenRoomAdd] = useState(false);
  const [openRoomEdit, setOpenRoomEdit] = useState(false);
  const [openRoomDelete, setOpenRoomDelete] = useState(false);

  const createRoomMutation = useCreateRoom(floor.id);
  const updateRoomMutation = useUpdateRoom(selectedRoom ? selectedRoom.id : "0", floor.id);
  const deleteRoomMutation = useDeleteRoom(selectedRoom ? selectedRoom.id : "0", floor.id);

  const [search, setSearch] = useState('');
  const filtered = useRoomFiltered(rooms, search);

  return (
    <>
      <Box sx={{width: "100%", maxWidth: 900}}>
        <Stack direction={{xs: "column", sm: "row"}} spacing={1} sx={{mb: 1}}>
          <TextField
            size="small"
            placeholder="Search name or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{input: {startAdornment: (<InputAdornment position="start"><SearchIcon/></InputAdornment>)}}}
            sx={{flex: 1}}
          />
          {selectedRoom && (
            <Button size="small" onClick={() => setSelectedRoom(null)}>Clear selection</Button>
          )}
          {isAdmin &&
            (<Button variant="contained" size="small" startIcon={<AddIcon/>} onClick={() => {
              setSelectedRoom(null);
              setOpenRoomAdd(true);
            }}>Add room</Button>)
          }
        </Stack>
        <Divider/>
        <List>
          {filtered && filtered.length > 0 ? filtered.map((room) => (
            <ListItem
              key={room.id}
              component="div"
              disableGutters
              secondaryAction={isAdmin &&
                  <>
                      <IconButton edge="end" aria-label="edit" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(room);
                        setOpenRoomEdit(true);
                      }} sx={{ml: 1}}>
                          <EditIcon/>
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" color="error" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(room);
                        setOpenRoomDelete(true);
                      }} sx={{ml: 1}}>
                          <DeleteIcon/>
                      </IconButton>
                  </>
              }
            >
              <ListItemButton
                selected={selectedRoom?.id === room.id}
                onClick={() => setSelectedRoom(room)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    borderLeft: '4px solid',
                    borderLeftColor: 'primary.main'
                  },
                  '&.Mui-selected:hover': {bgcolor: 'action.selected'},
                }}
              >
                <ListItemText
                  primary={room.name}
                  secondary={`(${room.xMm}, ${room.yMm}) | ${room.widthMm}x${room.heightMm} mm${room.description ? ' | ' + room.description : ''}`}
                />
              </ListItemButton>
            </ListItem>
          )) : (
            <ListItem component="div">
              <ListItemText primary="No rooms yet"/>
            </ListItem>
          )}
        </List>
      </Box>

      {/* Add Room Dialog */}
      <RoomDialog
        open={openRoomAdd}
        onClose={() => setOpenRoomAdd(false)}
        title="Add room"
        initialValues={{name: '', description: '', xMm: 0, yMm: 0, widthMm: 1000, heightMm: 1000}}
        floorWidthMm={floor.widthMm}
        floorHeightMm={floor.heightMm}
        onSubmit={({name, description, xMm, yMm, widthMm, heightMm}) => {
          // @ts-ignore - zod validation says this is unknown but also garantees it's a number
          createRoomMutation.mutate({name, description, xMm, yMm, widthMm, heightMm});
        }}
      />

      {/* Edit Room Dialog */}
      <RoomDialog
        open={openRoomEdit && !!selectedRoom}
        onClose={() => setOpenRoomEdit(false)}
        title="Edit room"
        initialValues={{
          name: selectedRoom?.name || '',
          description: selectedRoom?.description || '',
          xMm: selectedRoom?.xMm || 0,
          yMm: selectedRoom?.yMm || 0,
          widthMm: selectedRoom?.widthMm || 0,
          heightMm: selectedRoom?.heightMm || 0,
        }}
        floorWidthMm={floor.widthMm}
        floorHeightMm={floor.heightMm}
        onSubmit={({name, description, xMm, yMm, widthMm, heightMm}) => {
          if (!selectedRoom) return;
          // @ts-ignore - zod validation says this is unknown but also garantees it's a number
          updateRoomMutation.mutate({name, description, xMm, yMm, widthMm, heightMm});
        }}
      />

      {/* Delete Room Confirm */}
      <DeleteConfirmDialog
        open={openRoomDelete && !!selectedRoom}
        onClose={() => setOpenRoomDelete(false)}
        onConfirm={() => {
          if (!selectedRoom) return;
          deleteRoomMutation.mutate(undefined, {onSuccess: () => setSelectedRoom(null)});
        }}
        title={'Delete room'}
        message={selectedRoom ? `Are you sure you want to delete room "${selectedRoom.name}"?` : ''}
      />

    </>
  );
}
