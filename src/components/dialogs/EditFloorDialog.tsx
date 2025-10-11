import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, type SubmitHandler } from 'react-hook-form';

export interface EditFloorFormValues {
  name: string;
  description: string;
}

export interface EditFloorDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: EditFloorFormValues) => void; // optional, not implemented yet
}

export default function EditFloorDialog({ open, onClose, onSubmit }: EditFloorDialogProps) {
  const { register, handleSubmit, reset } = useForm<EditFloorFormValues>();

  const handleClose = () => {
    onClose();
    reset();
  };

  const submit: SubmitHandler<EditFloorFormValues> = (data) => {
    // functionality intentionally not implemented
    if (onSubmit) onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit floor</DialogTitle>
      <DialogContent>
        <form id="edit-floor-form" onSubmit={handleSubmit(submit)}>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Floor name"
            type="text"
            fullWidth
            variant="standard"
            {...register('name', { required: true })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            multiline
            minRows={2}
            {...register('description')}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="edit-floor-form">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
