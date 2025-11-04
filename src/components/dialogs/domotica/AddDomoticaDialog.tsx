import {DomoticaDialogBase, type DomoticaFormValues } from './DomoticaDialogBase.tsx';
import type {Domotica, DomoticaValue, Room} from '../../../model';
import { getDefaultValueForType } from './DomoticaTypeHelpers.tsx';

export interface AddDomoticaDialogProps {
  open: boolean;
  floorId: string;
  rooms: Room[]
  initialRoomId?: string;
  onClose: () => void;
  onCreate?: (payload: Omit<Domotica, 'id'>) => void | Promise<void>;
}

export function AddDomoticaDialog({ open, floorId, rooms, initialRoomId, onClose, onCreate }: Readonly<AddDomoticaDialogProps>) {
  const handleSubmit = async (values: DomoticaFormValues) => {
    if (!onCreate) return;
    const v = getDefaultValueForType(values.type) as DomoticaValue;
    const payload: Omit<Domotica, 'id'> = {
      floorId: values.floorId,
      roomId: values.roomId,
      name: values.name,
      description: values.description,
      type: values.type,
      upc: values.upc,
      x: values.x as number,
      y: values.y as number,
      value: v,
    };
    await onCreate(payload);
  };

  return (
    <DomoticaDialogBase
      open={open}
      onClose={onClose}
      mode="add"
      floorId={floorId}
      rooms={rooms}
      initialValues={{
          floorId,
          roomId: initialRoomId ?? '',
          name: '',
          description: '',
          type: 'light',
          upc: '',
          x: 0,
          y: 0,
        }}
      onSubmit={handleSubmit}
    />
  );
}
