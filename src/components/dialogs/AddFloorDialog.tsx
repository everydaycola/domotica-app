import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, type SubmitHandler } from 'react-hook-form';

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

export default function AddFloorDialog({ open, onClose, onSubmit }: AddItemDialogProps) {
  const { register, handleSubmit, reset } = useForm<AddItemFormValues>({
      defaultValues: {id: '', name: '', description: '', widthMm: 1000, heightMm: 1000}
  });

  const handleClose = () => {
    onClose();
    reset({id: '', name: '', description: '', widthMm: 1000, heightMm: 1000});
  };

  const submit: SubmitHandler<AddItemFormValues> = (data) => {
    const widthMm = Number(data.widthMm);
    const heightMm = Number(data.heightMm);
    const name = String(data.name).trim();
    const description = data.description?.trim();

    const validDims = widthMm >= 100 && widthMm <= 100000 && heightMm >= 100 && heightMm <= 100000;
    const validName = name.length > 0 && name.length <= 100;
    const validDesc = !description || description.length <= 500;

    if (onSubmit && data.id && validDims && validName && validDesc) {
      onSubmit({ id: data.id, name, description, widthMm, heightMm });
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add floor</DialogTitle>
      <DialogContent>
        <form id="add-item-form" onSubmit={handleSubmit(submit)}>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Floor number (id)"
            type="text"
            fullWidth
            variant="standard"
            {...register('id', {required: true})}
          />
          <TextField
            required
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 100 }}
            {...register('name', { required: true, minLength: 1, maxLength: 100 })}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 500 }}
            {...register('description', { maxLength: 500 })}
          />
          <TextField
            required
            margin="dense"
            label="Width (mm)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "1", min: 100, max: 100000 }}
            {...register('widthMm', { required: true, valueAsNumber: true, min: 100, max: 100000 })}
          />
          <TextField
            required
            margin="dense"
            label="Height (mm)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "1", min: 100, max: 100000 }}
            {...register('heightMm', { required: true, valueAsNumber: true, min: 100, max: 100000 })}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="add-item-form">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
