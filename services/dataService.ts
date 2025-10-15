import axios from "axios";
import type { Floor } from "../src/model/floor";
import type { Room } from "../src/model/room";

// Floors
export async function getFloors(id: string) {
    const { data: floors } = await axios.get(`/floors/${id}`);
    return floors as Floor;
}

export async function createFloor(floor: Pick<Floor, 'id' | 'name' | 'widthMm' | 'heightMm'> & { description?: string }) {
    const { data } = await axios.post('/floors', floor);
    return data as Floor;
}

export async function updateFloor(id: string, updates: Partial<Floor>) {
    const { data } = await axios.patch(`/floors/${id}`, updates);
    return data as Floor;
}

export async function deleteFloor(id: string) {
    await axios.delete(`/floors/${id}`);
    return { id } as { id: string };
}

// Rooms
export async function getRooms(floorId: string) {
    const { data } = await axios.get('/rooms', { params: { floorId } });
    return data as Room[];
}

export async function createRoom(floorId: string, room: Omit<Room, 'id' | 'floorId'>) {
    const payload = { ...room, floorId };
    const { data } = await axios.post('/rooms', payload);
    return data as Room;
}

export async function updateRoom(id: number, updates: Partial<Omit<Room, 'id' | 'floorId'>> & Partial<Pick<Room, 'floorId'>>) {
    const { data } = await axios.patch(`/rooms/${id}`, updates);
    return data as Room;
}

export async function deleteRoom(id: number) {
    await axios.delete(`/rooms/${id}`);
    return { id } as { id: number };
}