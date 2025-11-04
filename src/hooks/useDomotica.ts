import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Domotica, DomoticaType} from "../model";
import {createDomotica, deleteDomotica, readAllDomotica, readDomoticaByFloor, updateDomotica} from "../services";

export function useDomoticaByFloor(floorId: string) {
  const {isLoading, isError, data} = useQuery({
    queryKey: ["domotica", "floor", floorId],
    queryFn: () => readDomoticaByFloor(floorId),
  });
  return {isLoading, isError, domotica: (data ?? [])};
}

export function useAllDomotica() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["domotica", "all"],
    queryFn: () => readAllDomotica(),
  });
  return { isLoading, isError, domotica: (data ?? []) };
}

export function useDomoticaFiltered(
  domotica: Domotica[],
  roomId: string | null,
  search: string,
  type: DomoticaType | null
) {
  const q = (search ?? "").trim().toLowerCase();

  return (domotica ?? [])
    .filter((d) => (
        (roomId == null || d.roomId === roomId) &&
        (!type || type.includes(d.type)) &&
        `${d.name} ${d.description ?? ""}`.toLowerCase().includes(q)
      )
    )
    .slice()
    .sort((a, b) => {
      const favDiff = Number(!!b.favorite) - Number(!!a.favorite);
      if (favDiff !== 0) return favDiff;
      const ta = a.lastChange ? Date.parse(a.lastChange) : 0;
      const tb = b.lastChange ? Date.parse(b.lastChange) : 0;
      if (tb !== ta) return tb - ta; // newest first
      const nameDiff = a.name.localeCompare(b.name);
      if (nameDiff !== 0) return nameDiff;
      return a.type.localeCompare(b.type);
    });
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