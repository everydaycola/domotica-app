import DomoticaDialogBase, { type DomoticaFormValues } from './DomoticaDialogBase.tsx';
import type { Domotica, DomoticaValue } from '../../../model/domotica.ts';
import { getDefaultValueForType } from './DomoticaTypeHelpers.tsx';

export interface AddDomoticaDialogProps {
  open: boolean;
  floorId: string;
  initialRoomId?: number;
  onClose: () => void;
  onCreate?: (payload: Omit<Domotica, 'id'>) => void | Promise<void>;
}

export default function AddDomoticaDialog({ open, floorId, initialRoomId, onClose, onCreate }: Readonly<AddDomoticaDialogProps>) {
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
      x: values.x,
      y: values.y,
      defaultValue: v,
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
      initialValues={{
        floorId,
        roomId: initialRoomId ?? 0,
        name: '',
        description: '',
        type: 'light',
        upc: '',
        x: 0,
        y: 0,
      }}
      onSubmit={handleSubmit}
      title="Add domotica"
      submitLabel="Create"
    />
  );
}
