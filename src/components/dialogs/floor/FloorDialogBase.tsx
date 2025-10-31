import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

// Build schemas first, then infer types from them
const dim = z.coerce.number()
  .int('Must be an integer')
  .min(100, 'Min 100 mm')
  .max(100000, 'Max 100000 mm');

function makeSchema(isAdd: boolean) {
  return z.object({
    id: isAdd ? z.string().trim().min(1, 'Floor number is required') : z.string().optional(),
    name: z.string().trim().min(1, 'Name is required').max(100, 'Max 100 characters'),
    description: z.string().trim().max(500, 'Max 500 characters').optional().or(z.literal('')),
    widthMm: dim,
    heightMm: dim,
  });
}

// Concrete schemas for type inference
const addFloorSchema = makeSchema(true);
const editFloorSchema = makeSchema(false);

export type TAddFloorSchema = z.infer<typeof addFloorSchema>;
export type TEditFloorSchema = z.infer<typeof editFloorSchema>;

// Public type used by wrappers; union covers both modes
export type FloorFormValues = TAddFloorSchema | TEditFloorSchema;

export type FloorDialogBaseProps = {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialValues?: Omit<TEditFloorSchema, 'id'>; // used in edit mode
  onSubmit: (values: FloorFormValues) => void; // wrapper may ignore id in edit mode
};

export default function FloorDialogBase({ open, onClose, mode, initialValues, onSubmit }: Readonly<FloorDialogBaseProps>) {
  const isAdd = mode === 'add';
  const schema = isAdd ? addFloorSchema : editFloorSchema;

  const { register, handleSubmit, reset, formState: {errors} } = useForm<FloorFormValues>({
    mode: 'onBlur',
    defaultValues: (isAdd
      ? { id: '', name: '', description: '', widthMm: 1000, heightMm: 1000 }
      : { name: initialValues?.name ?? '', description: initialValues?.description ?? '', widthMm: initialValues?.widthMm ?? 0, heightMm: initialValues?.heightMm ?? 0 }) as any,
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    onClose();
    // reset to mode-specific defaults to avoid stale values when reopening
    if (isAdd) {
      reset({ id: '', name: '', description: '', widthMm: 1000, heightMm: 1000 } as any);
    } else {
      reset({ name: initialValues?.name ?? '', description: initialValues?.description ?? '', widthMm: initialValues?.widthMm ?? 0, heightMm: initialValues?.heightMm ?? 0 } as any);
    }
  };

  const submit = (data: FloorFormValues) => {
    onSubmit({
      id: isAdd ? (data as TAddFloorSchema).id : undefined,
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      widthMm: data.widthMm,
      heightMm: data.heightMm,
    });
    handleClose();
  };

  const title = isAdd ? 'Add floor' : 'Edit floor';
  const submitLabel = isAdd ? 'Add' : 'Save';
  const formId = isAdd ? 'add-item-form' : 'edit-floor-form';

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id={formId} onSubmit={handleSubmit(submit)}>
          {isAdd && (
            <TextField
              autoFocus
              required
              margin="dense"
              label="Floor number"
              type="text"
              fullWidth
              variant="standard"
              error={!!errors.id}
              helperText={errors.id?.message}
              {...register('id')}
            />
          )}
          <TextField
            autoFocus={!isAdd}
            required
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="standard"
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
          />
          <TextField
            required
            margin="dense"
            label="Width (mm)"
            type="number"
            fullWidth
            variant="standard"
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
            variant="standard"
            error={!!errors.heightMm}
            helperText={errors.heightMm?.message}
            {...register('heightMm')}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form={formId}>{submitLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
