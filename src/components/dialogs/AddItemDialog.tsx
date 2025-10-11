import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, type SubmitHandler } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';

export interface AddItemFormValues {
  name: string;
  type: string;
}

export interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddItemFormValues) => void; // optional placeholder
}

const TYPES = ['Room', 'Desk', 'Other'];

export default function AddItemDialog({ open, onClose, onSubmit }: AddItemDialogProps) {
  const { register, handleSubmit, reset } = useForm<AddItemFormValues>();

  const handleClose = () => {
    onClose();
    reset();
  };

  const submit: SubmitHandler<AddItemFormValues> = (data) => {
    if (onSubmit) onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add item</DialogTitle>
      <DialogContent>
        <form id="add-item-form" onSubmit={handleSubmit(submit)}>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            {...register('name', { required: true })}
          />
          <TextField
            select
            required
            margin="dense"
            label="Type"
            fullWidth
            variant="standard"
            defaultValue={TYPES[0]}
            {...register('type', { required: true })}
          >
            {TYPES.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="add-item-form">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
