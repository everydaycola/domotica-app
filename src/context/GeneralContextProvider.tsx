import {type ReactNode, useState} from 'react'
import {GeneralContext} from "./GeneralContext.ts";


interface GeneralContextProviderProps {
    children: ReactNode
}

export default function GeneralContextProvider({children}: GeneralContextProviderProps) {
    const [isAdmin, setIsAdmin] = useState<boolean>(true)

    return (
        <GeneralContext.Provider value={{
            isAdmin: isAdmin,
            setIsAdmin: setIsAdmin,
        }}>
            {children}
        </GeneralContext.Provider>
    )
}
