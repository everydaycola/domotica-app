import DomoticaDialogBase, {type DomoticaFormValues } from './DomoticaDialogBase.tsx';
import type { Domotica } from '../../../model/domotica.ts';

export interface EditDomoticaDialogProps {
  open: boolean;
  domotica: Domotica | null;
  floorId: string;
  onClose: () => void;
  onSave?: (payload: Partial<Domotica>) => void | Promise<void>;
}

export default function EditDomoticaDialog({ open, domotica, floorId, onClose, onSave }: Readonly<EditDomoticaDialogProps>) {
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
      x: values.x,
      y: values.y,
    };
    await onSave(update);
  };

  return (
    <DomoticaDialogBase
      open={open}
      onClose={onClose}
      mode="edit"
      floorId={floorId}
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
      title="Edit domotica"
      submitLabel="Save"
    />
  );
}
