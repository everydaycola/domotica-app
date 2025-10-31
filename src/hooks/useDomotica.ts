import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Domotica, DomoticaType} from "../model";
import {createDomotica, deleteDomotica, readAllDomotica, readDomoticaByFloor, updateDomotica} from "../services";

// Fetch all domotica on a floor
export function useDomoticaByFloor(floorId: string) {
  const {isLoading, isError, data} = useQuery({
    queryKey: ["domotica", "floor", floorId],
    queryFn: () => readDomoticaByFloor(floorId),
  });
  return {isLoading, isError, domotica: (data ?? [])};
}

// Fetch all domotica across all floors (for global selections like scenes)
export function useAllDomotica() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["domotica", "all"],
    queryFn: () => readAllDomotica(),
  });
  return { isLoading, isError, domotica: (data ?? []) };
}

// client-side filtering by room, search and type
export function useDomoticaFiltered(
  floorId: string,
  roomId: number | null,
  search: string,
  type: DomoticaType | null
) {
  const {isLoading, isError, domotica} = useDomoticaByFloor(floorId);
  const q = (search ?? "").trim().toLowerCase();

  const filtered = (domotica ?? [])
    .filter((d) => (
      (roomId == null || d.roomId === roomId) &&
      (!type || type.includes(d.type)) &&
      `${d.name} ${d.description ?? ""}`.toLowerCase().includes(q)
    )
  );

  return {isLoading, isError, domotica: filtered};
}

export function useUpdateDomotica(id: string, floorId: string) {
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

export function useDeleteDomotica(id: string, floorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDomotica(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["domotica", "floor", String(floorId)]});
    },
  });
}