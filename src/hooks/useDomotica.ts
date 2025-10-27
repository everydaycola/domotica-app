import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createDomotica, deleteDomotica, getDomoticaByFloor, updateDomotica} from "../services/dataService";
import type {Domotica, DomoticaType} from "../model/domotica";

// Fetch all domotica on a floor
export function useDomoticaByFloor(floorId: string) {
  const {isLoading, isError, data} = useQuery({
    queryKey: ["domotica", "floor", floorId],
    queryFn: () => getDomoticaByFloor(floorId),
  });
  return {isLoading, isError, domotica: (data ?? [])};
}

// client-side filtering by room, search and type
export function useDomoticaFiltered(
  floorId: string,
  options?: {
    roomId?: number | null;
    search?: string;
    types?: DomoticaType[]
  }
) {
  const {isLoading, isError, domotica} = useDomoticaByFloor(floorId);
  const {roomId, search, types} = options ?? {};
  const q = (search ?? "").trim().toLowerCase();

  const filtered = (domotica ?? []).filter((d) => {
    if (roomId != null && d.roomId !== roomId) return false;
    if (types && types.length > 0 && !types.includes(d.type)) return false;
    if (q) {
      const hay = `${d.name} ${d.description ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return {isLoading, isError, domotica: filtered};
}

export function useUpdateDomotica(id: number, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Domotica>) => updateDomotica(String(id), updates),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["domotica", "floor", String(floorId)]});
    },
  });
}

export function useCreateDomotica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domotica: Omit<Domotica, "id">) => createDomotica(domotica),
    onSuccess: (created) => {
      // best effort: invalidate floor scope
      queryClient.invalidateQueries({queryKey: ["domotica", "floor", String(created.floorId)]});
    },
  });
}

export function useDeleteDomotica(id: number, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDomotica(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["domotica", "floor", String(floorId)]});
    },
  });
}