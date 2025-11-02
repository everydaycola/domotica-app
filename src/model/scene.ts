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
  // Flag to indicate whether the scene is user-created (custom) or a default one
  isCustom: boolean;
  // New optional fields for sorting and UX
  favorite?: boolean;
  lastTrigger?: string | null; // ISO datetime of last trigger
};
