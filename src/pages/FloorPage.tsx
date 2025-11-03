import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {BaseFloorPlan} from "../components/floorPlan/BaseFloorPlan.tsx";
import {Box, Divider, Stack, Typography, Skeleton} from "@mui/material";
import {DomoticaList, ScenesList, RoomsList, FloorsList} from "../components/lists";
import type {Room} from "../model";
import {useRooms, useDomoticaByFloor, useFloor, useScenes} from "../hooks";
import {ErrorPage} from "./ErrorPage.tsx";
import {
  BaseFloorPlanSkeleton,
  DomoticaListSkeleton,
  RoomsListSkeleton,
  ScenesListSkeleton
} from "../components/skeletons";

export function FloorPage() {
  const navigate = useNavigate();
  const floorNumber = useParams().id!

  const { floor, isLoading: floorIsLoading } = useFloor(floorNumber);
  const { rooms, isLoading: roomsIsLoading, isError: roomsIsError } = useRooms(floorNumber);
  const { domotica, isLoading: domoticaIsLoading } = useDomoticaByFloor(floorNumber);
  const { isLoading: scenesIsLoading } = useScenes();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // If second hook (rooms) errors, show a friendly error page but keep app bar and routing
  if (roomsIsError) {
    return (
      <ErrorPage
        title="Unable to load rooms"
        message="We couldn't load the rooms for this floor. Please try again, or go back to the home page."
        onRetry={() => window.location.reload()}
      />
    );
  }

  // If floor data is missing after loading, try to fallback to floor 0
  if (!floor && floorNumber !== '0' && !floorIsLoading) navigate(`/floor/0`);

  return (
    <Box sx={{px: 2}}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'flex-start', gap: 3, width: '100%' }}>
        <Box sx={{ width: { xs: '100%', lg: 360 } }}>
          <FloorsList
            activeFloor={floorNumber}
            onFloorChange={(floorNumber: string) => {
              setSelectedRoom(null)
              navigate(`/floor/${floorNumber}`)
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ textAlign: 'left', width: '100%', mb: 1 }}>
            {floorIsLoading ? (
              <>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="text" width={320} />
              </>
            ) : (
              <>
                <Typography variant="h5" component="h1">{floor?.name}</Typography>
                {floor?.description && (
                  <Typography variant="body2" color="text.secondary">{floor.description}</Typography>
                )}
              </>
            )}
          </Box>

          {(floorIsLoading || roomsIsLoading || domoticaIsLoading) ? (
            <BaseFloorPlanSkeleton />
          ) : (
            <BaseFloorPlan
              widthMm={floor?.widthMm ?? 0}
              heightMm={floor?.heightMm ?? 0}
              floorId={floorNumber}
              rooms={rooms}
              domotica={domotica}
              selectedRoomId={selectedRoom?.id ?? null}
              onSelectRoom={(r) => setSelectedRoom(r)}
            />
          )}
        </Box>
      </Box>

      <Divider/>

      <Box sx={{ px: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%', mt: 2, alignItems: 'flex-start' }}>
          {(floorIsLoading || roomsIsLoading || !floor) ? (
            <RoomsListSkeleton />
          ) : (
            <RoomsList
              floor={floor}
              rooms={rooms}
              selectedRoom={selectedRoom}
              setSelectedRoom={(room) => setSelectedRoom(room)}
              clearRoomSelection={() => setSelectedRoom(null)}
            />
          )}
          <Box sx={{ flex: 2, minWidth: 320 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Domotica</Typography>
            <Divider />
            {domoticaIsLoading ? (
              <DomoticaListSkeleton />
            ) : (
              <DomoticaList floorId={floorNumber} selectedRoomId={selectedRoom?.id ?? null} clearRoomSelection={() => setSelectedRoom(null)} />
            )}
          </Box>
          <Box sx={{ flex: 2, minWidth: 320 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Scenes</Typography>
            <Divider />
            {scenesIsLoading ? (
              <ScenesListSkeleton />
            ) : (
              <ScenesList />
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
