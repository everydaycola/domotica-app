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

  const { floor, isLoading: floorIsLoading, isError: floorIsError } = useFloor(floorNumber);
  const { rooms, isLoading: roomsIsLoading, isError: roomsIsError } = useRooms(floorNumber);
  const { domotica, isLoading: domoticaIsLoading, isError: domoticaIsError } = useDomoticaByFloor(floorNumber);
  const { scenes, isLoading: scenesIsLoading, isError: scenesIsError } = useScenes();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // If any error, show a friendly error page but keep app bar and routing
  if (floorIsError || roomsIsError || domoticaIsError || scenesIsError) {
    return (
      <ErrorPage
        title="Something went wrong"
        message="Please try again later. If the problem persists, please contact the administrator."
        onRetry={() => globalThis.location.reload()}
      />
    );
  }

  // If floor data is missing after loading, try to fallback to floor 0
  if (!floor && floorNumber !== '0' && !floorIsLoading) navigate(`/floor/0`);

  return (
    <Box sx={{p: 3}}>
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

      <Box>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 2, minWidth: 320 }}>
            <Typography variant="h6">Rooms</Typography>
            <Divider sx={{ mb: 2 }} />
            {(floorIsLoading || roomsIsLoading || !floor) ? (
              <RoomsListSkeleton />
            ) : (
              <RoomsList
                floor={floor}
                rooms={rooms}
                selectedRoom={selectedRoom}
                setSelectedRoom={(room) => setSelectedRoom(room)}
              />
            )}
          </Box>
          <Box sx={{ flex: 2, minWidth: 320 }}>
            <Typography variant="h6">Domotica</Typography>
            <Divider sx={{ mb: 2 }} />
            {domoticaIsLoading ? (
              <DomoticaListSkeleton />
            ) : (
              <DomoticaList
                floorId={floorNumber}
                rooms={rooms}
                domotica={domotica}
                selectedRoomId={selectedRoom?.id ?? null}
                clearRoomSelection={() => setSelectedRoom(null)}
              />
            )}
          </Box>
          <Box sx={{ flex: 2, minWidth: 320 }}>
            <Typography variant="h6">Scenes</Typography>
            <Divider sx={{ mb: 2 }} />
            {scenesIsLoading ? (
              <ScenesListSkeleton />
            ) : (
              <ScenesList scenes={scenes}/>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
