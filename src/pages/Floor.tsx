import {useNavigate, useParams} from "react-router-dom";
import CustomAppBar from "../components/appBar/AppBar.tsx";
import BuildingFloorsList from "../components/building/BuildingFloorsList";
import {GeneralContext} from "../context/GeneralContext.ts";
import {useContext, useEffect, useState} from "react";
import {BaseFloorPlan} from "../components/floorPlan/BaseFloorPlan.tsx";
import {Box, Divider, Stack, Typography} from "@mui/material";
import DomoticaList from "../components/domotica/DomoticaList";
import RoomsList from "../components/rooms/RoomsList";
import AddFloorDialog from "../components/dialogs/AddFloorDialog.tsx";
import DeleteConfirmDialog from "../components/dialogs/DeleteConfirmDialog.tsx";
import RoomDialog from "../components/dialogs/RoomDialog.tsx";
import type {Room} from "../model/room";
import {useCreateFloor, useFloor} from "../hooks/useFloor.ts";
import {useCreateRoom, useDeleteRoom, useRooms, useUpdateRoom} from "../hooks/useRooms.ts";


export function Floor() {
  const navigate = useNavigate();
  const { id: floorNumber } = useParams();
  const { setFloorNumber } = useContext(GeneralContext);
  const { floor, isLoading, isError } = useFloor(floorNumber!);
  const { rooms, isLoading: isRoomsLoading } = useRooms(floorNumber!);

  const createFloorMutation = useCreateFloor();

  const createRoomMutation = useCreateRoom(floorNumber!);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const updateRoomMutation = useUpdateRoom(selectedRoom ? selectedRoom.id : 0, floorNumber!);
  const deleteRoomMutation = useDeleteRoom(selectedRoom ? selectedRoom.id : 0, floorNumber!);

  useEffect(() => {
    setFloorNumber(floorNumber || "1");
  }, [floorNumber, setFloorNumber]);

  const [openDialog, setOpenDialog] = useState<null | "Edit" | "Add" | "Delete">(null);
  const [openRoomAdd, setOpenRoomAdd] = useState(false);
  const [openRoomEdit, setOpenRoomEdit] = useState(false);
  const [openRoomDelete, setOpenRoomDelete] = useState(false);

  if (isLoading || isRoomsLoading) return <div>Loading...</div>;
  if (isError || !floor) return <div>Error</div>;

  return (
    <>
      <CustomAppBar />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'flex-start', m: 3, gap: 3, width: '100%' }}>
        {/* Left: Building Floors list with actions */}
        <Box sx={{ width: { xs: '100%', lg: 360 } }}>
          <BuildingFloorsList
            onAdd={() => setOpenDialog('Add')}
          />
        </Box>

        {/* Right: Title, Plan */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ textAlign: 'left', width: '100%', mb: 1 }}>
            <Typography variant="h5" component="h1">{floor.name}</Typography>
            {floor.description && (
              <Typography variant="body2" color="text.secondary">{floor.description}</Typography>
            )}
          </Box>

          <BaseFloorPlan
            widthMm={floor.widthMm}
            heightMm={floor.heightMm}
            floorId={floorNumber!}
            rooms={rooms}
            selectedRoomId={selectedRoom?.id ?? null}
            onSelectRoom={(r) => setSelectedRoom(r)}
          />
        </Box>
      </Box>

      {/* Rooms and Domotica Section below the plan (Domotica left, Rooms right) */}
      <Box sx={{ px: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%', mt: 2, alignItems: 'flex-start' }}>
          <RoomsList
            rooms={rooms}
            selectedRoomId={selectedRoom?.id ?? null}
            selectedRoomName={selectedRoom?.name ?? null}
            onSelectRoom={(room) => setSelectedRoom(room)}
            onAddRoom={() => { setSelectedRoom(null); setOpenRoomAdd(true); }}
            onEditRoom={(room) => { setSelectedRoom(room); setOpenRoomEdit(true); }}
            onDeleteRoom={(room) => { setSelectedRoom(room); setOpenRoomDelete(true); }}
            clearRoomSelection={() => setSelectedRoom(null)}
          />
          <Box sx={{ flex: 2, minWidth: 320 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Domotica</Typography>
            <Divider />
            <DomoticaList floorId={floorNumber!} selectedRoomId={selectedRoom?.id ?? null} clearRoomSelection={() => setSelectedRoom(null)} />
          </Box>
        </Stack>
      </Box>

      <AddFloorDialog
        open={openDialog === "Add"}
        onClose={() => setOpenDialog(null)}
        onSubmit={({ id, name, description, widthMm, heightMm }) => {
          createFloorMutation.mutate({ id, name, description, widthMm, heightMm }, {
            onSuccess: (newFloor) => {
              navigate(`/floor/${newFloor.id}`);
            }
          });
        }}
      />

      {/* Add Room Dialog */}
      <RoomDialog
        open={openRoomAdd}
        onClose={() => setOpenRoomAdd(false)}
        title="Add room"
        initialValues={{ name: '', description: '', xMm: 0, yMm: 0, widthMm: 1000, heightMm: 1000 }}
        floorWidthMm={floor.widthMm}
        floorHeightMm={floor.heightMm}
        onSubmit={({ name, description, xMm, yMm, widthMm, heightMm }) => {
          createRoomMutation.mutate({ name, description, xMm, yMm, widthMm, heightMm });
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
        onSubmit={({ name, description, xMm, yMm, widthMm, heightMm }) => {
          if (!selectedRoom) return;
          updateRoomMutation.mutate({ name, description, xMm, yMm, widthMm, heightMm });
        }}
      />

      {/* Delete Room Confirm */}
      <DeleteConfirmDialog
        open={openRoomDelete && !!selectedRoom}
        onClose={() => setOpenRoomDelete(false)}
        onConfirm={() => {
          if (!selectedRoom) return;
          deleteRoomMutation.mutate(undefined, { onSuccess: () => setSelectedRoom(null) });
        }}
        title={'Delete room'}
        message={selectedRoom ? `Are you sure you want to delete room "${selectedRoom.name}"?` : ''}
      />
    </>
  );
}
