import {createContext} from 'react'

export interface GeneralContextType {
    floorNumber: number | null
    setFloorNumber: (floor: number) => void
}

export const GeneralContext = createContext<GeneralContextType>({
    floorNumber: null,
    setFloorNumber: () => {
    },
})
