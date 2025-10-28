import FloorDialogBase, { type FloorFormValues } from './FloorDialogBase.tsx';

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

export default function EditFloorDialog({ open, onClose, initialValues, onSubmit }: Readonly<EditFloorDialogProps>) {
  const handleSubmit = (values: FloorFormValues) => {
    onSubmit({ name: values.name, description: values.description, widthMm: values.widthMm, heightMm: values.heightMm });
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
