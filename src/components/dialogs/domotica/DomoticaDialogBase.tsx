import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import { useEffect } from "react";
import type {DomoticaType, Room} from "../../../model";
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

export interface DomoticaDialogBaseProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  floorId: string,
  rooms: Room[],
  initialValues?: DomoticaFormValues // used in edit mode
  onSubmit: (values: DomoticaFormValues) => void | Promise<void>
}

const schema = z.object({
  floorId: z.string().min(1),
  roomId:  z.string().min(1, "Please select a room."),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Max 100 characters'),
  description: z.string().trim().max(500, 'Max 500 characters').optional().or(z.literal('')),
  type: z.enum(['light','heating','door','audio']),
  upc: z.string().trim().length(13, 'UPC must be 13 characters'),
  x: z.coerce.number().int('Must be an integer').min(0, 'Must be ≥ 0'),
  y: z.coerce.number().int('Must be an integer').min(0, 'Must be ≥ 0'),
});
export type DomoticaFormValues = z.input<typeof schema>;

export function DomoticaDialogBase(
  {
    open,
    onClose,
    mode,
    floorId,
    rooms,
    initialValues,
    onSubmit,
  }: Readonly<DomoticaDialogBaseProps>) {
  const isAdd = mode === 'add';

  const {control, handleSubmit, reset, register, formState: {errors}} = useForm<DomoticaFormValues>({
    defaultValues: {
      floorId: initialValues?.floorId ?? floorId,
      roomId: initialValues?.roomId ?? '',
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      type: (initialValues?.type ?? "light") as DomoticaType,
      upc: initialValues?.upc ?? "",
      x: initialValues?.x ?? 0,
      y: initialValues?.y ?? 0,
    },
    mode: "onBlur",
    resolver: zodResolver(schema, undefined, { mode: 'sync' }),
    shouldFocusError: true,
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    reset({
      floorId: initialValues?.floorId ?? floorId,
      roomId: initialValues?.roomId ?? '',
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      type: (initialValues?.type ?? "light") as DomoticaType,
      upc: initialValues?.upc ?? "",
      x: initialValues?.x ?? 0,
      y: initialValues?.y ?? 0,
    });
  }, [open, initialValues, floorId, rooms, reset]);

  const resolvedTitle = isAdd ? 'Add domotica' : 'Edit domotica';
  const resolvedSubmit = isAdd ? 'Create' : 'Save';

  const formId = isAdd ? 'add-domotica-form' : 'edit-domotica-form';

  const handleClose = () => {
    onClose();
    reset({
      floorId,
      roomId: '',
      name: '',
      description: '',
      type: 'light' as DomoticaType,
      upc: '',
      x: 0,
      y: 0,
    });
  };

  const submit = async (data: DomoticaFormValues) => {
    await onSubmit({
      ...data,
      description: data.description?.trim() || undefined,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{resolvedTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}} component="form" id={formId} onSubmit={handleSubmit(submit)}>
          <TextField
            label="Name"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label="Description"
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
          />
          <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
            <Controller
              name="type"
              control={control}
              render={({field}) => (
                <FormControl fullWidth size="small" error={!!errors.type}>
                  <Select {...field} displayEmpty>
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="heating">Heating</MenuItem>
                    <MenuItem value="door">Door</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                  </Select>
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="roomId"
              control={control}
              render={({field}) => (
                <FormControl fullWidth size="small" error={!!errors.roomId}>
                  <Select {...field} displayEmpty onChange={(e) => field.onChange(String(e.target.value))}>
                    <MenuItem value="">
                      <em>Select room</em>
                    </MenuItem>
                    {rooms?.map((r) => (
                      <MenuItem key={r.id} value={String(r.id)}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.roomId?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Stack>
          <TextField
            label="UPC"
            fullWidth
            required
            error={!!errors.upc}
            helperText={errors.upc?.message}
            {...register('upc')}
          />
          <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
            <TextField
              label="X (mm)"
              type="number"
              fullWidth
              error={!!errors.x}
              helperText={errors.x?.message}
              {...register('x')}
            />
            <TextField
              label="Y (mm)"
              type="number"
              fullWidth
              error={!!errors.y}
              helperText={errors.y?.message}
              {...register('y')}
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
