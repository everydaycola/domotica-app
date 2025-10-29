import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {type SubmitHandler, useForm} from 'react-hook-form';

export type FloorFormValues = {
  id?: string; // only used in add mode
  name: string;
  description?: string;
  widthMm: number;
  heightMm: number;
};

export type FloorDialogBaseProps = {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialValues?: Omit<FloorFormValues, 'id'>; // used in edit mode
  onSubmit: (values: FloorFormValues) => void; // wrapper may ignore id in edit mode
};

export default function FloorDialogBase({ open, onClose, mode, initialValues, onSubmit }: Readonly<FloorDialogBaseProps>) {
  const isAdd = mode === 'add';

  const { register, handleSubmit, reset } = useForm<FloorFormValues>({
    defaultValues: isAdd
      ? { id: '', name: '', description: '', widthMm: 1000, heightMm: 1000 }
      : { name: initialValues?.name ?? '', description: initialValues?.description ?? '', widthMm: initialValues?.widthMm ?? 0, heightMm: initialValues?.heightMm ?? 0 },
  });

  const handleClose = () => {
    onClose();
    // reset to mode-specific defaults to avoid stale values when reopening
    if (isAdd) {
      reset({ id: '', name: '', description: '', widthMm: 1000, heightMm: 1000 });
    } else {
      reset({ name: initialValues?.name ?? '', description: initialValues?.description ?? '', widthMm: initialValues?.widthMm ?? 0, heightMm: initialValues?.heightMm ?? 0 });
    }
  };

  const submit: SubmitHandler<FloorFormValues> = (data) => {
    const name = String(data.name).trim();
    const description = data.description?.trim();

    const validDims = data.widthMm >= 100 && data.widthMm <= 100000 && data.heightMm >= 100 && data.heightMm <= 100000;
    const validName = name.length > 0 && name.length <= 100;
    const validDesc = !description || description.length <= 500;

    const idOk = isAdd ? Boolean(data.id) : true;

    if (validDims && validName && validDesc && idOk) {
      onSubmit({ id: isAdd ? data.id : undefined, name, description, widthMm: data.widthMm, heightMm: data.heightMm });
    }
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
              {...register('id', { required: isAdd })}
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
            inputProps={{ step: '1', min: 100, max: 100000 }}
            {...register('widthMm', { required: true, valueAsNumber: true, min: 100, max: 100000 })}
          />
          <TextField
            required
            margin="dense"
            label="Height (mm)"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: '1', min: 100, max: 100000 }}
            {...register('heightMm', { required: true, valueAsNumber: true, min: 100, max: 100000 })}
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
