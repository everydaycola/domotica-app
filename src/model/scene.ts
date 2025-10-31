import type { DomoticaValue } from './domotica';

export type SceneControl = {
  domoticaId: string;
  value: DomoticaValue;
};

export type Scene = {
  id: string;
  name: string;
  description?: string;
  image?: string; // URL
  controls: SceneControl[];
};
