import {createContext} from 'react'

export interface GeneralContextType {
    floorNumber: string | null
    setFloorNumber: (floor: string) => void
    isAdmin: boolean
    setIsAdmin: (isAdmin: boolean) => void
}

export const GeneralContext = createContext<GeneralContextType>({
    floorNumber: null,
    setFloorNumber: () => {},
    isAdmin: true,
    setIsAdmin: () => {},
})
