import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFloor, deleteFloor, getFloors, updateFloor } from "../services/dataService";
import type { Floor } from "../src/model/floor";

export function useFloor(id: string) {
    const { isLoading, isError, data: floor } = useQuery({
        queryKey: ['floor', id],
        queryFn: () => getFloors(id)
    });

    return { isLoading, isError, floor };
}

export function useUpdateFloor(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updates: Partial<Floor>) => updateFloor(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floor', String(id)] });
        }
    });
}

export function useCreateFloor() {
    return useMutation({
        mutationFn: (floor: Pick<Floor, 'id' | 'name' | 'widthMm' | 'heightMm'> & { description?: string }) => createFloor(floor)
    });
}

export function useDeleteFloor(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteFloor(id),
        onSuccess: () => {
            // Invalidate the cache for the deleted floor
            queryClient.removeQueries({ queryKey: ['floor', String(id)] });
        }
    });
}
