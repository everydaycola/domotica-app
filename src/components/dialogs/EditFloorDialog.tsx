import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as React from "react";

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

export default function EditFloorDialog({ open, onClose, initialValues, onSubmit }: EditFloorDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm<EditFloorFormValues>({
    defaultValues: initialValues
  });

  const handleClose = () => {
    onClose();
    reset(initialValues);
  };

  const submit: SubmitHandler<EditFloorFormValues> = (data) => {
    const widthMm = Number(data.widthMm);
    const heightMm = Number(data.heightMm);
    const name = String(data.name).trim();
    const description = data.description?.trim();

    // validation
    const validDims = widthMm >= 100 && widthMm <= 100000 && heightMm >= 100 && heightMm <= 100000;
    const validName = name.length > 0 && name.length <= 100;
    const validDesc = !description || description.length <= 500;

    if (validDims && validName && validDesc) {
      onSubmit({ name, description, widthMm, heightMm });
    }
    handleClose();
  };

  // Ensure the inputs reflect updated initialValues when dialog opens for different floors
  React.useEffect(() => {
    if (open) {
      setValue('name', initialValues.name);
      setValue('description', initialValues.description || '');
      setValue('widthMm', initialValues.widthMm);
      setValue('heightMm', initialValues.heightMm);
    }
  }, [open, initialValues, setValue]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit floor</DialogTitle>
      <DialogContent>
        <form id="edit-floor-form" onSubmit={handleSubmit(submit)}>
          <TextField
            autoFocus
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
        <Button type="submit" form="edit-floor-form">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
