export type Domotica = {
    id: string;
    floorId: string;
    roomId: number;
    name: string;
    description?: string;
    type: DomoticaType;
    upc: string;
    defaultValue: DomoticaValue;
    value: DomoticaValue;
    x: number;
    y: number;
}

export type DomoticaType = 'light' | 'heating' | 'door' | 'audio'

export type DomoticaValue = lightValue | heatingValue | doorValue | audioValue

export type lightValue = {
    on: boolean;
    brightness: number; // 0-100
}

export type heatingValue = {
    temperature: number; // in °C
}

export type doorValue = {
    open: boolean;
}

export type audioValue = {
    volume: number; // 0-100
}