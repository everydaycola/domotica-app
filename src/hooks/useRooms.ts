import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Room} from "../model/room";
import {createRoom, deleteRoom, readRoom, updateRoom} from "../services/roomService.ts";

export function useRooms(floorId: string) {
  const {isLoading, isError, data: rooms} = useQuery({
    queryKey: ["rooms", floorId],
    queryFn: () => readRoom(floorId),
  });
  return {isLoading, isError, rooms: (rooms ?? [])};
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

export function useUpdateRoom(roomId: number, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Omit<Room, "id" | "floorId">>) => updateRoom(roomId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rooms", String(floorId)]});
    },
  });
}

export function useDeleteRoom(roomId: number, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rooms", String(floorId)]});
    },
  });
}
