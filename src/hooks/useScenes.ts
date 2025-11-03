import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Scene } from '../model';
import { createScene, deleteScene, readScenes, updateScene, updateDomotica } from '../services';
import { GeneralContext } from '../context/GeneralContext';

export function useScenes() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['scenes'],
    queryFn: () => readScenes(),
  });
  return { isLoading, isError, scenes: (data ?? []) };
}

export function getFilteredAndSortedScenes(scenes: Scene[] | undefined, search: string) {
  return (scenes ?? [])
    .filter(s =>
      `${s.name} ${s.description ?? ''}`
        .toLowerCase()
        .includes(
          (search ?? '')
            .trim()
            .toLowerCase()
        )
    )
    .slice()
    .sort((a, b) => {
      const favDiff = Number(!!b.favorite) - Number(!!a.favorite);
      if (favDiff !== 0) return favDiff;
      const ta = a.lastTrigger ? Date.parse(a.lastTrigger) : 0;
      const tb = b.lastTrigger ? Date.parse(b.lastTrigger) : 0;
      if (tb !== ta) return tb - ta;
      return a.name.localeCompare(b.name);
    });
}

export function useCreateScene() {
  const queryClient = useQueryClient();
  const { isAdmin } = useContext(GeneralContext);
  return useMutation({
    mutationFn: (scene: Omit<Scene, 'id' | 'isCustom'>) => {
      const withFlag: Omit<Scene, 'id'> = { ...scene, isCustom: !isAdmin } as Omit<Scene, 'id'>;
      return createScene(withFlag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}

export function useUpdateScene(sceneId: string) {
  const queryClient = useQueryClient();
  const { isAdmin } = useContext(GeneralContext);
  return useMutation({
    mutationFn: async (updates: Partial<Scene>) => {
      const existing = (queryClient.getQueryData(['scenes']) as (Scene[] | undefined))?.find(s => String(s.id) === String(sceneId));
      if (existing) {
        if (!isAdmin && !existing.isCustom) {
          throw new Error('Default scenes can only be modified by admins.');
        }
        const patch: Partial<Scene> = { ...updates, isCustom: existing.isCustom };
        return updateScene(String(sceneId), patch);
      }
      if (!isAdmin) {
        throw new Error('Insufficient permissions to modify this scene.');
      }
      return updateScene(String(sceneId), updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}

export function useDeleteScene(sceneId: string) {
  const queryClient = useQueryClient();
  const { isAdmin } = useContext(GeneralContext);
  return useMutation({
    mutationFn: async () => {
      const existing = (queryClient.getQueryData(['scenes']) as (Scene[] | undefined))?.find(s => String(s.id) === String(sceneId));
      if (existing && !isAdmin && !existing.isCustom) {
        throw new Error('Default scenes can only be deleted by admins.');
      }
      if (!existing && !isAdmin) {
        throw new Error('Insufficient permissions to delete this scene.');
      }
      return deleteScene(String(sceneId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}

export function useTriggerScene() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scene: Scene) => {
      for (const control of scene.controls) {
        await updateDomotica(String(control.domoticaId), { value: control.value });
      }
      const nowIso = new Date().toISOString();
      await updateScene(String(scene.id), { lastTrigger: nowIso });
      return { ...scene, lastTrigger: nowIso } as Scene;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domotica'] });
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });
}
