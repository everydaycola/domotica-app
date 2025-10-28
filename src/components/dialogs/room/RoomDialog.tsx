import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as React from 'react';

export interface RoomFormValues {
  name: string;
  description?: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
}

export interface RoomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialValues: RoomFormValues;
  onSubmit: (values: RoomFormValues) => void;
  floorWidthMm: number;
  floorHeightMm: number;
}

export default function RoomDialog({ open, onClose, title = 'Room', initialValues, onSubmit, floorWidthMm, floorHeightMm }: Readonly<RoomDialogProps>) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RoomFormValues>({
    defaultValues: initialValues,
  });

  const handleClose = () => {
    onClose();
    reset(initialValues);
  };

  const submit: SubmitHandler<RoomFormValues> = (data) => {
    const name = String(data.name).trim();
    const description = data.description?.trim();
    const xMm = Number(data.xMm);
    const yMm = Number(data.yMm);
    const widthMm = Number(data.widthMm);
    const heightMm = Number(data.heightMm);

    const nonNegative = xMm >= 0 && yMm >= 0 && widthMm >= 0 && heightMm >= 0;
    const withinBounds = xMm + widthMm <= floorWidthMm && yMm + heightMm <= floorHeightMm;
    const validName = name.length > 0 && name.length <= 100;
    const validDesc = !description || description.length <= 500;

    if (nonNegative && withinBounds && validName && validDesc) {
      onSubmit({ name, description, xMm, yMm, widthMm, heightMm });
    }
    handleClose();
  };

  React.useEffect(() => {
    if (open) {
      setValue('name', initialValues.name);
      setValue('description', initialValues.description || '');
      setValue('xMm', initialValues.xMm);
      setValue('yMm', initialValues.yMm);
      setValue('widthMm', initialValues.widthMm);
      setValue('heightMm', initialValues.heightMm);
    }
  }, [open, initialValues, setValue]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="room-form" onSubmit={handleSubmit(submit)}>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 100 }}
            error={!!errors.name}
            helperText={errors.name ? 'Name is required (max 100 chars)' : ''}
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
            label="X (mm from left)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: '1', min: 0 }}
            error={!!errors.xMm}
            helperText={errors.xMm ? `X must be >= 0 and X + width <= ${floorWidthMm}` : ''}
            {...register('xMm', { required: true, valueAsNumber: true, min: 0 })}
          />
          <TextField
            required
            margin="dense"
            label="Y (mm from top)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: '1', min: 0 }}
            error={!!errors.yMm}
            helperText={errors.yMm ? `Y must be >= 0 and Y + height <= ${floorHeightMm}` : ''}
            {...register('yMm', { required: true, valueAsNumber: true, min: 0 })}
          />
          <TextField
            required
            margin="dense"
            label="Width (mm)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: '1', min: 0 }}
            error={!!errors.widthMm}
            helperText={errors.widthMm ? `Width must be >= 0 and X + width <= ${floorWidthMm}` : ''}
            {...register('widthMm', { required: true, valueAsNumber: true, min: 0 })}
          />
          <TextField
            required
            margin="dense"
            label="Height (mm)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: '1', min: 0 }}
            error={!!errors.heightMm}
            helperText={errors.heightMm ? `Height must be >= 0 and Y + height <= ${floorHeightMm}` : ''}
            {...register('heightMm', { required: true, valueAsNumber: true, min: 0 })}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="room-form">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
