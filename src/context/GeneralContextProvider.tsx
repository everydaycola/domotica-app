import {type ReactNode, useState} from 'react'
import {GeneralContext} from "./GeneralContext.ts";


interface GeneralContextProviderProps {
    children: ReactNode
}

export default function GeneralContextProvider({children}: GeneralContextProviderProps) {
    const [floorNumber, setFloorNumber] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(true)

    return (
        <GeneralContext.Provider value={
            {
                floorNumber: floorNumber,
                setFloorNumber: setFloorNumber,
                isAdmin: isAdmin,
                setIsAdmin: setIsAdmin,
            }
        }>

            {children}
        </GeneralContext.Provider>
    )
}
