import {createContext} from 'react'

export interface GeneralContextType {
    floorNumber: string | null
    setFloorNumber: (floor: string) => void
}

export const GeneralContext = createContext<GeneralContextType>({
    floorNumber: null,
    setFloorNumber: () => {
    },
})
