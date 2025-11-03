import {FloorDialogBase, type FloorFormValues} from './FloorDialogBase.tsx';

export interface EditFloorFormValues {
  name: string;
  description?: string;
  widthMm: number;
  heightMm: number;
}

export interface EditFloorDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues: EditFloorFormValues;
  onSubmit: (values: EditFloorFormValues) => void;
}

export function EditFloorDialog({ open, onClose, initialValues, onSubmit }: Readonly<EditFloorDialogProps>) {
  const handleSubmit = (values: FloorFormValues) => {
    onSubmit({ name: values.name, description: values.description, widthMm: values.widthMm as number, heightMm: values.heightMm as number });
  };

  return (
    <FloorDialogBase
      open={open}
      onClose={onClose}
      mode="edit"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
