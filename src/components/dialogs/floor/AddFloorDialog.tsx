import {FloorDialogBase, type FloorFormValues} from './FloorDialogBase.tsx';

export interface AddItemFormValues {
  id: string;
  name: string;
  description?: string;
  widthMm: number;
  heightMm: number;
}

export interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddItemFormValues) => void;
}

export function AddFloorDialog({ open, onClose, onSubmit }: Readonly<AddItemDialogProps>) {
  const handleSubmit = (values: FloorFormValues) => {
    if (!onSubmit) return;
    onSubmit({ id: values.id || '', name: values.name, description: values.description, widthMm: values.widthMm, heightMm: values.heightMm });
  };

  return (
    <FloorDialogBase
      open={open}
      onClose={onClose}
      mode="add"
      onSubmit={handleSubmit}
    />
  );
}
