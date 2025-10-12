import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, type SubmitHandler } from 'react-hook-form';

export interface AddItemFormValues {
  id: string;
  ratio: number;
}

export interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddItemFormValues) => void;
}

export default function AddItemDialog({ open, onClose, onSubmit }: AddItemDialogProps) {
  const { register, handleSubmit, reset } = useForm<AddItemFormValues>({
      defaultValues: {id: '', ratio: 1}
  });

  const handleClose = () => {
    onClose();
      reset({id: '', ratio: 1});
  };

  const submit: SubmitHandler<AddItemFormValues> = (data) => {
      const ratio = Number(data.ratio);
      if (onSubmit && data.id && ratio > 0) onSubmit({id: data.id, ratio});
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
            label="Ratio (width / length)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{step: "0.01"}}
            {...register('ratio', { required: true, valueAsNumber: true, min: 0.01 })}
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
