import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import type {DomoticaType} from "../../../model/domotica.ts";
import {useRooms} from "../../../hooks/useRooms.ts";

export interface DomoticaFormValues {
  floorId: string
  roomId: number
  name: string
  description?: string
  type: DomoticaType
  upc: string
  x: number
  y: number
}

export interface DomoticaDialogBaseProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  floorId: string
  initialValues?: DomoticaFormValues // used in edit mode
  onSubmit: (values: DomoticaFormValues) => void
  title?: string // allow override when desired
  submitLabel?: string // allow override when desired
}

export default function DomoticaDialogBase(
  {
    open,
    onClose,
    mode,
    floorId,
    initialValues,
    onSubmit,
    title,
    submitLabel
  }: Readonly<DomoticaDialogBaseProps>) {
  const isAdd = mode === 'add';
  const {rooms} = useRooms(floorId);

  const {control, handleSubmit, reset} = useForm<DomoticaFormValues>({
    defaultValues: {
      floorId: initialValues?.floorId ?? floorId,
      roomId: initialValues?.roomId ?? (rooms?.[0]?.id ?? 0),
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      type: initialValues?.type ?? "light",
      upc: initialValues?.upc ?? "",
      x: initialValues?.x ?? 0,
      y: initialValues?.y ?? 0,
    },
  });

  const resolvedTitle = title ?? (isAdd ? 'Add domotica' : 'Edit domotica');
  const resolvedSubmit = submitLabel ?? (isAdd ? 'Create' : 'Save');

  const formId = isAdd ? 'add-domotica-form' : 'edit-domotica-form';

  const handleClose = () => {
    onClose();
    // reset after close so reopening starts fresh
    reset({
      floorId,
      roomId: rooms?.[0]?.id ?? 0,
      name: '',
      description: '',
      type: 'light',
      upc: '',
      x: 0,
      y: 0,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{resolvedTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}} component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({field}) => (
              <TextField label="Name" fullWidth {...field} />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({field}) => (
              <TextField label="Description" fullWidth {...field} />
            )}
          />
          <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
            <Controller
              name="type"
              control={control}
              render={({field}) => (
                <Select fullWidth size="small" {...field}>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="heating">Heating</MenuItem>
                  <MenuItem value="door">Door</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                </Select>
              )}
            />
            <Controller
              name="roomId"
              control={control}
              render={({field}) => (
                <Select fullWidth size="small" {...field}>
                  {rooms?.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Stack>
          <Controller
            name="upc"
            control={control}
            render={({field}) => <TextField label="UPC" fullWidth {...field} />}
          />
          <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
            <Controller
              name="x"
              control={control}
              render={({field}) => (
                <TextField
                  label="X (mm)"
                  type="number"
                  fullWidth
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="y"
              control={control}
              render={({field}) => (
                <TextField
                  label="Y (mm)"
                  type="number"
                  fullWidth
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit" form={formId}>
          {resolvedSubmit}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
