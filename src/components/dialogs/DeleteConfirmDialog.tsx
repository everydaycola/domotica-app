import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { useForm, type SubmitHandler } from 'react-hook-form';

export interface DeleteFormValues {
  reason?: string;
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (values: DeleteFormValues) => void; // optional placeholder
  title?: string;
  message?: string;
  confirmDisabled?: boolean;
}

export default function DeleteConfirmDialog({ open, onClose, onConfirm, title = 'Delete item', message = 'Are you sure you want to delete this item?', confirmDisabled = false }: DeleteConfirmDialogProps) {
  const {handleSubmit, reset } = useForm<DeleteFormValues>();

  const handleClose = () => {
    onClose();
    reset();
  };

  const submit: SubmitHandler<DeleteFormValues> = (data) => {
    if (onConfirm) onConfirm(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>{message}</DialogContentText>
        <form id="delete-confirm-form" onSubmit={handleSubmit(submit)}>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" type="submit" form="delete-confirm-form" disabled={confirmDisabled}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
