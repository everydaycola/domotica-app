import {createContext} from 'react'

export interface GeneralContextType {
    floor: number | null
    setFloor: (floor: number) => void
}

export const GeneralContext = createContext<GeneralContextType>({
    floor: null,
    setFloor: () => {
    },
})
