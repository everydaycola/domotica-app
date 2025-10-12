import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as React from "react";

export interface EditFloorFormValues {
  ratio: number;
}

export interface EditFloorDialogProps {
  open: boolean;
  onClose: () => void;
  initialRatio: number;
  onSubmit: (values: EditFloorFormValues) => void;
}

export default function EditFloorDialog({ open, onClose, initialRatio, onSubmit }: EditFloorDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<EditFloorFormValues>({
    defaultValues: { ratio: initialRatio }
  });

  const handleClose = () => {
    onClose();
    reset({ ratio: initialRatio });
  };

  const submit: SubmitHandler<EditFloorFormValues> = (data) => {
    const ratio = Number(data.ratio);
    if (ratio > 0) {
      onSubmit({ ratio });
    }
    handleClose();
  };

  // Ensure the input reflects updated initialRatio when dialog opens for different floors
  React.useEffect(() => {
    if (open) {
      setValue('ratio', initialRatio);
    }
  }, [open, initialRatio, setValue]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit floor ratio</DialogTitle>
      <DialogContent>
        <form id="edit-floor-form" onSubmit={handleSubmit(submit)}>
          <TextField
            autoFocus
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
        <Button type="submit" form="edit-floor-form">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
