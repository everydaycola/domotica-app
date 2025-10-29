import FloorDialogBase, {type FloorFormValues} from './FloorDialogBase.tsx';

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

export default function AddFloorDialog({ open, onClose, onSubmit }: Readonly<AddItemDialogProps>) {
  const handleSubmit = (values: FloorFormValues) => {
    if (!onSubmit) return;
    // values.id is defined in add mode
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
