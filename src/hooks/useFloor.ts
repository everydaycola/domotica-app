import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createFloor, deleteFloor, getFloor, getAllFloors, updateFloor} from "../services/dataService";
import type {Floor} from "../model/floor.ts";

export function useFloor(id: string) {
  const {isLoading, isError, data: floor} = useQuery({
    queryKey: ['floor', id],
    queryFn: () => getFloor(id)
  });

  return {isLoading, isError, floor};
}

export function useUpdateFloor(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Floor>) => updateFloor(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['floor', String(id)]});
      queryClient.invalidateQueries({queryKey: ['floors']});
    }
  });
}

export function useCreateFloor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (floor: Pick<Floor, 'id' | 'name' | 'widthMm' | 'heightMm'> & {
      description?: string
    }) => createFloor(floor),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['floors']});
    }
  });
}

export function useDeleteFloor(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteFloor(id),
    onSuccess: () => {
      // Invalidate the cache for the deleted floor
      queryClient.removeQueries({queryKey: ['floor', String(id)]});
      queryClient.invalidateQueries({queryKey: ['floors']});
    }
  });
}

export function useFloorsList() {
  const {isLoading, isError, data: floors} = useQuery({
    queryKey: ['floors'],
    queryFn: () => getAllFloors()
  });
  return {isLoading, isError, floors: floors ?? []};
}
