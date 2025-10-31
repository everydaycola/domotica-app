import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

export interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  confirmDisabled?: boolean;
}

export function DeleteConfirmDialog(
  {
    open,
    onClose,
    onConfirm,
    title = 'Delete item',
    message = 'Are you sure you want to delete this item?',
    confirmDisabled = false
  }: Readonly<DeleteConfirmDialogProps>) {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          onClick={handleConfirm}
          disabled={confirmDisabled}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}