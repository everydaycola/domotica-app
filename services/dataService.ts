import axios from "axios";

export async function getFloors(id: string) {
    const {data: floors} = await axios.get(`/floors/${id}`)
    return floors
}