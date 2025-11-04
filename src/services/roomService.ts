import axios from "axios";
import type {Room} from "../model";

export async function readRoom(floorId: string) {
  const {data} = await axios.get('/rooms', {params: {floorId}});
  return data as Room[];
}

export async function createRoom(floorId: string, room: Omit<Room, 'id' | 'floorId'>) {
  const payload = {...room, floorId};
  const {data} = await axios.post('/rooms', payload);
  return data as Room;
}

export async function updateRoom(id: string, updates: Partial<Omit<Room, 'id' | 'floorId'>> & Partial<Pick<Room, 'floorId'>>) {
  const {data} = await axios.patch(`/rooms/${id}`, updates);
  return data as Room;
}

export async function deleteRoom(id: string) {
  await axios.delete(`/rooms/${id}`);
  return {id} as { id: string };
}