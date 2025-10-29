import {useNavigate, useParams} from "react-router-dom";
import FloorsList from "../components/lists/FloorsList.tsx";
import {useState} from "react";
import {BaseFloorPlan} from "../components/floorPlan/BaseFloorPlan.tsx";
import {Box, Divider, Stack, Typography} from "@mui/material";
import DomoticaList from "../components/lists/DomoticaList";
import RoomsList from "../components/lists/RoomsList";
import type {Room} from "../model/room";
import {useRooms} from "../hooks/useRooms.ts";
import {useDomoticaByFloor} from "../hooks/useDomotica.ts";
import {useFloor} from "../hooks/useFloor.ts";


export function FloorPage() {
  const navigate = useNavigate();
  // get floor number from url
  const floorNumber = useParams().id!

  // get floor, rooms and domotica data from api
  const { floor, isLoading: floorIsLoading, isError: floorIsError } = useFloor(floorNumber);
  const { rooms, isLoading: roomsIsLoading, isError: roomsIsError } = useRooms(floorNumber);
  const { domotica, isLoading: domoticaIsLoading, isError: domoticaIsError } = useDomoticaByFloor(floorNumber);
  const isLoading = floorIsLoading || roomsIsLoading || domoticaIsLoading;
  const isError = floorIsError || roomsIsError || domoticaIsError;

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // todo improve this
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!floor && floorNumber !== '0') navigate(`/floor/0`)
  if (!floor) return <div>Error</div> // fallback

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'flex-start', m: 3, gap: 3, width: '100%' }}>
        <Box sx={{ width: { xs: '100%', lg: 360 } }}>
          <FloorsList
            floorNumber={floorNumber}
            navigate={navigate}
          />
        </Box>

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
            floorId={floorNumber}
            rooms={rooms}
            domotica={domotica}
            selectedRoomId={selectedRoom?.id ?? null}
            onSelectRoom={(r) => setSelectedRoom(r)}
          />
        </Box>
      </Box>

      {/* Rooms and Domotica Section below the plan (Domotica left, Rooms right) */}
      <Box sx={{ px: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%', mt: 2, alignItems: 'flex-start' }}>
          <RoomsList
            floor={floor}
            rooms={rooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={(room) => setSelectedRoom(room)}
            clearRoomSelection={() => setSelectedRoom(null)}
          />
          <Box sx={{ flex: 2, minWidth: 320 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Domotica</Typography>
            <Divider />
            <DomoticaList floorId={floorNumber} selectedRoomId={selectedRoom?.id ?? null} clearRoomSelection={() => setSelectedRoom(null)} />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
