import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Scene } from '../model';
import { createScene, deleteScene, readScenes, updateScene, updateDomotica } from '../services';

export function useScenes() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['scenes'],
    queryFn: () => readScenes(),
  });
  return { isLoading, isError, scenes: (data ?? []) };
}

export function useCreateScene() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scene: Omit<Scene, 'id'>) => createScene(scene),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}

export function useUpdateScene(sceneId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Scene>) => updateScene(String(sceneId), updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}

export function useDeleteScene(sceneId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteScene(String(sceneId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}

// Triggering a scene: apply all controls by updating domotica values
export function useTriggerScene() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scene: Scene) => {
      // sequential updates to keep it simple and json-server friendly
      for (const control of scene.controls) {
        await updateDomotica(String(control.domoticaId), { value: control.value });
      }
      // Update scene last trigger timestamp
      const nowIso = new Date().toISOString();
      await updateScene(String(scene.id), { lastTrigger: nowIso });
      return { ...scene, lastTrigger: nowIso } as Scene;
    },
    onSuccess: () => {
      // refresh domotica state globally for all floors and scenes list
      queryClient.invalidateQueries({ queryKey: ['domotica'] });
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}
