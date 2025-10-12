import {type ReactNode, useState} from 'react'
import {GeneralContext} from "./GeneralContext.ts";


interface GeneralContextProviderProps {
    children: ReactNode
}

export default function GenralContextProvider({children}: GeneralContextProviderProps) {
    const [floorNumber, setFloorNumberState] = useState<string | null>(null)
    const setFloorNumber = (floor: string) => setFloorNumberState(floor)

    return (
        <GeneralContext.Provider value={
            {
                floorNumber: floorNumber,
                setFloorNumber: setFloorNumber
            }
        }>

            {children}
        </GeneralContext.Provider>
    )
}
