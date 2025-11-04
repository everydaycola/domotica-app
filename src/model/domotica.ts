import type {Playlist} from "./playlist.ts";

export type Domotica = {
    id: string;
    floorId: string;
    roomId: string;
    name: string;
    description?: string;
    type: DomoticaType;
    upc: string;
    value: DomoticaValue;
    x: number;
    y: number;
    playlists?: Playlist[];
    favorite?: boolean;
    lastChange?: string | null;
}

export type DomoticaType = 'light' | 'heating' | 'door' | 'audio'

export type DomoticaValue = lightValue | heatingValue | doorValue | audioValue

export type lightValue = {
    on: boolean;
    brightness: number;
}

export type heatingValue = {
    temperature: number;
}

export type doorValue = {
    open: boolean;
}

export type audioValue = {
    volume: number;
    playlistId: string | null;
}