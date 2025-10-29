import type {Domotica} from "../model/domotica.ts";
import axios from "axios";

export async function readDomoticaByFloor(floorId: string) {
  const {data} = await axios.get('/domotica', {params: {floorId}});
  return data as Domotica[];
}

export async function createDomotica(domotica: Omit<Domotica, 'id'>) {
  const {data} = await axios.post('/domotica', domotica);
  return data as Domotica;
}

export async function updateDomotica(id: string, updates: Partial<Domotica>) {
  const {data} = await axios.patch(`/domotica/${id}`, updates);
  return data as Domotica;
}

export async function deleteDomotica(id: string) {
  await axios.delete(`/domotica/${id}`);
}