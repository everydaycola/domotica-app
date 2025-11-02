import type { DomoticaValue } from './domotica';

export type SceneControl = {
  domoticaId: string;
  value: DomoticaValue;
};

export type Scene = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  controls: SceneControl[];
  isCustom: boolean;
  favorite?: boolean;
  lastTrigger?: string | null;
};
