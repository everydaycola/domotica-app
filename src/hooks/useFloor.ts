import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Floor} from "../model";
import {createFloor, deleteFloor, readAllFloors, readFloor, updateFloor} from "../services";

export function useFloor(id: string) {
  const {isLoading, isError, data: floor} = useQuery({
    queryKey: ['floor', id],
    queryFn: () => readFloor(id)
  });
  return {isLoading, isError, floor: floor};
}

export function useFloorsList() {
  const {isLoading, isError, data: floors} = useQuery({
    queryKey: ['floors'],
    queryFn: () => readAllFloors()
  });
  return {isLoading, isError, floors: (floors ?? [])};
}

export function useUpdateFloor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; updates: Partial<Floor> }) => updateFloor(vars.id, vars.updates),
    onSuccess: (_data, variables) => {
      console.log('onSuccess');
      queryClient.invalidateQueries({ queryKey: ['floor', String(variables.id)] });
      queryClient.invalidateQueries({ queryKey: ['floors'] });
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
      queryClient.removeQueries({queryKey: ['floor', String(id)]});
      queryClient.invalidateQueries({queryKey: ['floors']});
    }
  });
}
