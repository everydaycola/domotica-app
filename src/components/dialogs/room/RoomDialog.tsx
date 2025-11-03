import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {type SubmitHandler, useForm} from 'react-hook-form';
import { useEffect } from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

export interface RoomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialValues: RoomFormValues;
  onSubmit: (values: RoomFormValues) => void;
  floorWidthMm: number;
  floorHeightMm: number;
}

const coerceInt = (min?: number) =>
  z.coerce.number()
    .int('Must be an integer')
    .refine(v => (min === undefined ? true : v >= min), { message: `Must be ≥ ${min}` });

const baseRoomSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Max 100 characters'),
  description: z.string().trim().max(500, 'Max 500 characters').optional().or(z.literal('')),
  xMm: coerceInt(0),
  yMm: coerceInt(0),
  widthMm: coerceInt(1),
  heightMm: coerceInt(1),
});
export type RoomFormValues = z.input<typeof baseRoomSchema>;

function makeSchema(floorWidthMm: number, floorHeightMm: number) {
  return baseRoomSchema.superRefine((data, ctx) => {
    if (data.xMm + data.widthMm > floorWidthMm) {
      ctx.addIssue({
        code: "custom",
        message: `X + width must be ≤ ${floorWidthMm}`,
        path: ['widthMm']
      });
    }
    if (data.yMm + data.heightMm > floorHeightMm) {
      ctx.addIssue({
        code: "custom",
        message: `Y + height must be ≤ ${floorHeightMm}`,
        path: ['heightMm']
      });
    }
  });
}

export function RoomDialog({ open, onClose, title = 'Room', initialValues, onSubmit, floorWidthMm, floorHeightMm }: Readonly<RoomDialogProps>) {
  const schema = makeSchema(floorWidthMm, floorHeightMm);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoomFormValues>({
    mode: 'onBlur',
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    onClose();
    reset(initialValues);
  };

  useEffect(() => {
    reset(initialValues);
  }, [open, initialValues, reset]);

  const submit: SubmitHandler<RoomFormValues> = (data) => {
    onSubmit({
      ...data,
      description: data.description?.trim() || undefined,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="room-form" onSubmit={handleSubmit(submit)} noValidate>
          <TextField
            required
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            type="text"
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
          />
          <TextField
            required
            margin="dense"
            label="X (mm from left)"
            type="number"
            fullWidth
            error={!!errors.xMm}
            helperText={errors.xMm?.message}
            {...register('xMm')}
          />
          <TextField
            required
            margin="dense"
            label="Y (mm from top)"
            type="number"
            fullWidth
            error={!!errors.yMm}
            helperText={errors.yMm?.message}
            {...register('yMm')}
          />
          <TextField
            required
            margin="dense"
            label="Width (mm)"
            type="number"
            fullWidth
            error={!!errors.widthMm}
            helperText={errors.widthMm?.message}
            {...register('widthMm')}
          />
          <TextField
            required
            margin="dense"
            label="Height (mm)"
            type="number"
            fullWidth
            error={!!errors.heightMm}
            helperText={errors.heightMm?.message}
            {...register('heightMm')}
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
