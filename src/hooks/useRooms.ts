import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Room} from "../model";
import {createRoom, deleteRoom, readRoom, updateRoom} from "../services";

export function useRooms(floorId: string) {
  const {isLoading, isError, data: rooms} = useQuery({
    queryKey: ["rooms", floorId],
    queryFn: () => readRoom(floorId),
  });
  return {isLoading, isError, rooms: (rooms ?? [])};
}

export function useRoomFiltered(rooms: Room[] | undefined, search: string) {
  return (rooms ?? [])
    .filter(s =>
      `${s.name} ${s.description ?? ''}`
        .toLowerCase()
        .includes(
          (search ?? '')
            .trim()
            .toLowerCase()
        )
    )
}

export function useCreateRoom(floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (room: Omit<Room, "id" | "floorId">) => createRoom(floorId, room),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rooms", String(floorId)]});
    },
  });
}

export function useUpdateRoom(roomId: string, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Omit<Room, "id" | "floorId">>) => updateRoom(roomId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rooms", String(floorId)]});
    },
  });
}

export function useDeleteRoom(roomId: string, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rooms", String(floorId)]});
    },
  });
}
