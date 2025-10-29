import {createContext} from 'react'

export interface GeneralContextType {
    isAdmin: boolean
    setIsAdmin: (isAdmin: boolean) => void
}

export const GeneralContext = createContext<GeneralContextType>({
    isAdmin: true,
    setIsAdmin: () => {},
})
