import {useNavigate, useParams} from "react-router-dom";
import CustomAppBar from "../components/appBar/AppBar.tsx";
import ActionsSpeedDial, {type Action} from "../components/actionsSpeedDial/ActionsSpeedDial.tsx";
import {GeneralContext} from "../context/GeneralContext.ts";
import {useContext, useEffect, useState} from "react";
import {BaseFloorPlan} from "../components/floorPlan/BaseFloorPlan.tsx";
import {Box, Divider, Stack, Typography} from "@mui/material";
import DomoticaList from "../components/domotica/DomoticaList";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RoomsList from "../components/rooms/RoomsList";
import EditFloorDialog from "../components/dialogs/EditFloorDialog.tsx";
import AddFloorDialog from "../components/dialogs/AddFloorDialog.tsx";
import DeleteConfirmDialog from "../components/dialogs/DeleteConfirmDialog.tsx";
import RoomDialog from "../components/dialogs/RoomDialog.tsx";
import type {Room} from "../model/room";
import {useCreateFloor, useDeleteFloor, useFloor, useUpdateFloor} from "../hooks/useFloor.ts";
import {useCreateRoom, useDeleteRoom, useRooms, useUpdateRoom} from "../hooks/useRooms.ts";

const actions: Action[] = [
  { icon: <AspectRatioIcon />, name: "Edit" },
  { icon: <AddBoxIcon />, name: "Add" },
  { icon: <DeleteForeverIcon />, name: "Delete" },
];

export function Floor() {
  const navigate = useNavigate();
  const { id: floorNumber } = useParams();
  const { setFloorNumber } = useContext(GeneralContext);
  const { floor, isLoading, isError } = useFloor(floorNumber!);
  const { rooms, isLoading: isRoomsLoading } = useRooms(floorNumber!);

  const isGroundFloor = floorNumber === "0";

  const updateFloorMutation = useUpdateFloor(floorNumber!);
  const createFloorMutation = useCreateFloor();
  const deleteFloorMutation = useDeleteFloor(floorNumber!);

  const createRoomMutation = useCreateRoom(floorNumber!);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const updateRoomMutation = useUpdateRoom(selectedRoom ? selectedRoom.id : 0, floorNumber!);
  const deleteRoomMutation = useDeleteRoom(selectedRoom ? selectedRoom.id : 0, floorNumber!);

  useEffect(() => {
    setFloorNumber(floorNumber ? floorNumber : "1");
  }, [floorNumber, setFloorNumber]);

  const [openDialog, setOpenDialog] = useState<null | "Edit" | "Add" | "Delete">(null);
  const [openRoomAdd, setOpenRoomAdd] = useState(false);
  const [openRoomEdit, setOpenRoomEdit] = useState(false);
  const [openRoomDelete, setOpenRoomDelete] = useState(false);

  const handleAction = (name: string) => {
    if (name === "Edit" || name === "Add" || name === "Delete") {
      setOpenDialog(name);
    }
  };

  const closeDialog = () => setOpenDialog(null);

  if (isLoading || isRoomsLoading) return <div>Loading...</div>;
  if (isError || !floor) return <div>Error</div>;

  return (
    <>
      <CustomAppBar />

      <Box sx={{ display: "flex", flexDirection: 'column', alignItems: "center", m: 5, gap: 2 }}>
        {/* Name and optional description above the floor plan */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography variant="h5" component="h1">{floor.name}</Typography>
          {floor.description && (
            <Typography variant="body2" color="text.secondary">{floor.description}</Typography>
          )}
        </Box>

        <BaseFloorPlan widthMm={floor.widthMm} heightMm={floor.heightMm} floorId={floorNumber!} rooms={rooms} selectedRoomId={selectedRoom?.id ?? null} onSelectRoom={(r) => setSelectedRoom(r)} />
        <ActionsSpeedDial actions={actions} onAction={handleAction} />

        {/* Rooms and Domotica Section */}
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
            {/* Domotica List */}
            <DomoticaList floorId={floorNumber!} selectedRoomId={selectedRoom?.id ?? null} clearRoomSelection={() => setSelectedRoom(null)} />
          </Box>
        </Stack>
      </Box>

      <EditFloorDialog
        open={openDialog === "Edit"}
        onClose={closeDialog}
        initialValues={{
          name: floor.name,
          description: floor.description ?? '',
          widthMm: floor.widthMm,
          heightMm: floor.heightMm,
        }}
        onSubmit={({ name, description, widthMm, heightMm }) => {
          updateFloorMutation.mutate({ name, description: description || undefined, widthMm, heightMm });
        }}
      />

      <AddFloorDialog
        open={openDialog === "Add"}
        onClose={closeDialog}
        onSubmit={({ id, name, description, widthMm, heightMm }) => {
          createFloorMutation.mutate({ id, name, description, widthMm, heightMm }, {
            onSuccess: (newFloor) => {
              navigate(`/floor/${newFloor.id}`);
            }
          });
        }}
      />

      <DeleteConfirmDialog
        open={openDialog === "Delete"}
        onClose={closeDialog}
        onConfirm={() => {
          if (isGroundFloor) return; // just to be sure
          deleteFloorMutation.mutate(undefined, {
            onSuccess: () => {
              navigate('/floor/0');
            }
          });
        }}
        title={isGroundFloor ? 'Cannot delete ground floor' : 'Delete floor'}
        message={isGroundFloor ? 'Ground floor (floor 0) cannot be deleted.' : `Are you sure you want to delete floor ${floorNumber}?`}
        confirmDisabled={isGroundFloor}
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
