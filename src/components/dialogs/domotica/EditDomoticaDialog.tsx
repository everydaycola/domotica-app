import {DomoticaDialogBase, type DomoticaFormValues } from './DomoticaDialogBase.tsx';
import type {Domotica, Room} from '../../../model';

export interface EditDomoticaDialogProps {
  open: boolean;
  domotica: Domotica | null;
  floorId: string;
  rooms: Room[]
  onClose: () => void;
  onSave?: (payload: Partial<Domotica>) => void | Promise<void>;
}

export function EditDomoticaDialog({ open, domotica, floorId, rooms, onClose, onSave }: Readonly<EditDomoticaDialogProps>) {
  if (!domotica) return null;

  const handleSubmit = async (values: DomoticaFormValues) => {
    if (!onSave) return;
    const update: Partial<Domotica> = {
      id: domotica.id,
      floorId: values.floorId,
      roomId: values.roomId,
      name: values.name,
      description: values.description,
      type: values.type,
      upc: values.upc,
      x: values.x as number,
      y: values.y as number,
    };
    await onSave(update);
  };

  return (
    <DomoticaDialogBase
      open={open}
      onClose={onClose}
      mode="edit"
      floorId={floorId}
      rooms={rooms}
      initialValues={{
        floorId: domotica.floorId,
        roomId: domotica.roomId,
        name: domotica.name,
        description: domotica.description,
        type: domotica.type,
        upc: domotica.upc,
        x: domotica.x,
        y: domotica.y,
      }}
      onSubmit={handleSubmit}
    />
  );
}
