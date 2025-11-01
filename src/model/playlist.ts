export type Playlist = {
  id: string;
  name: string;
  // relation in backend for embedding by domotica
  // json-server uses this for /domotica?_embed=playlists
  domoticaId?: string;
}
