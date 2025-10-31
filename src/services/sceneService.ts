import axios from 'axios';
import type { Scene } from '../model';

export async function readScenes() {
  const { data } = await axios.get('/scenes');
  return data as Scene[];
}

export async function createScene(scene: Omit<Scene, 'id'>) {
  const { data } = await axios.post('/scenes', scene);
  return data as Scene;
}

export async function updateScene(id: string, updates: Partial<Scene>) {
  const { data } = await axios.patch(`/scenes/${id}`, updates);
  return data as Scene;
}

export async function deleteScene(id: string) {
  await axios.delete(`/scenes/${id}`);
}
