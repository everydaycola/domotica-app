import {type ReactNode, useState} from 'react'
import {GeneralContext} from "./GeneralContext.ts";


interface GenralContextProviderProps {
    children: ReactNode
}

export default function GenralContextProvider({children}: GenralContextProviderProps) {
    const [floor, setFloor] = useState<number | null>(null)

    return (
        <GeneralContext.Provider value={
            {
                floor: floor,
                setFloor: setFloor
            }
        }>

            {children}
        </GeneralContext.Provider>
    )
}
