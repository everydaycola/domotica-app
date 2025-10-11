import {type ReactNode, useState} from 'react'
import {GeneralContext} from "./GeneralContext.ts";


interface GenralContextProviderProps {
    children: ReactNode
}

export default function GenralContextProvider({children}: GenralContextProviderProps) {
    const [floorNumber, setFloorNumberState] = useState<number | null>(null)
    const setFloorNumber = (floor: number) => setFloorNumberState(floor)

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
