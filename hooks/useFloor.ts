import {useQuery} from "@tanstack/react-query";
import {getFloors} from "../services/dataService";


export function useFloor(id: string) {
    const {isLoading, isError, data: floor} = useQuery({
        queryKey: ['floor', id],
        queryFn: () => getFloors(id)
    })

    return {isLoading, isError, floor}
}
