import axios from "axios";
import type { Floor } from "../src/model/floor";

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