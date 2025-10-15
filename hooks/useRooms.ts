import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoom, deleteRoom, getRooms, updateRoom } from "../services/dataService";
import type { Room } from "../src/model/room";

export function useRooms(floorId: string) {
  const { isLoading, isError, data: rooms } = useQuery({
    queryKey: ["rooms", floorId],
    queryFn: () => getRooms(floorId),
  });
  return { isLoading, isError, rooms: (rooms ?? []) as Room[] };
}

export function useCreateRoom(floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (room: Omit<Room, "id" | "floorId">) => createRoom(floorId, room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", String(floorId)] });
    },
  });
}

export function useUpdateRoom(roomId: number, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Omit<Room, "id" | "floorId">>) => updateRoom(roomId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", String(floorId)] });
    },
  });
}

export function useDeleteRoom(roomId: number, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", String(floorId)] });
    },
  });
}
