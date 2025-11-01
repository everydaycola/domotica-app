import type {Playlist} from "./playlist.ts";

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
    // Optional embedded playlists when fetched with _embed=playlists
    playlists?: Playlist[];
    // New optional fields for sorting and UX
    favorite?: boolean;
    lastChange?: string | null; // ISO datetime of last value change
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
    playlistId: string | null; // FK to playlists.id
}