import {useEffect} from "react";
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
import type {audioValue, Domotica, DomoticaType, doorValue, heatingValue, lightValue} from "../../../model/domotica.ts";
import {useRooms} from "../../../hooks/useRooms.ts";
import {useForm, Controller} from "react-hook-form";

interface DomoticaDetailsDialogProps {
  open: boolean;
  domotica: Domotica | null;
  floorId: string;
  onClose: () => void;
  onSave: (payload: Partial<Domotica> | Omit<Domotica, "id">, isCreate: boolean) => Promise<void> | void;
  creating: boolean;
}

export function DomoticaDetailsDialog({open, domotica, floorId, onClose, onSave, creating}: Readonly<DomoticaDetailsDialogProps>) {
  const {rooms} = useRooms(floorId);
  const initial = domotica ?? ({} as Domotica);

  const { control, handleSubmit, reset } = useForm<Domotica>({
    defaultValues: {
      id: initial.id,
      floorId: initial.floorId ?? floorId,
      roomId: initial.roomId ?? (rooms?.[0]?.id ?? 0),
      name: initial.name ?? "",
      description: initial.description ?? "",
      type: initial.type ?? ("light" as DomoticaType),
      upc: initial.upc ?? "",
      x: initial.x ?? 0,
      y: initial.y ?? 0,
      defaultValue: initial.defaultValue ?? ({on: false, brightness: 100} as any),
      value: initial.value ?? ({on: false, brightness: 100} as any),
    }
  });

  // Reset form when domotica changes
  useEffect(() => {
    if (domotica) {
      reset({
        id: domotica.id,
        floorId: domotica.floorId ?? floorId,
        roomId: domotica.roomId ?? (rooms?.[0]?.id ?? 0),
        name: domotica.name ?? "",
        description: domotica.description ?? "",
        type: domotica.type ?? ("light" as DomoticaType),
        upc: domotica.upc ?? "",
        x: domotica.x ?? 0,
        y: domotica.y ?? 0,
        defaultValue: domotica.defaultValue ?? ({on: false, brightness: 100} as any),
        value: domotica.value ?? ({on: false, brightness: 100} as any),
      });
    }
  }, [domotica, floorId, rooms, reset]);

  // Helper function to get default values based on type
  const getDefaultValueForType = (type: DomoticaType) => {
    switch (type) {
      case "light":
        return { on: false, brightness: 100 } as lightValue;
      case "heating":
        return { temperature: 16 } as heatingValue;
      case "door":
        return { open: false } as doorValue;
      case "audio":
      default:
        return { volume: 0 } as audioValue;
    }
  };

  const onSubmit = async (data: Domotica) => {
    // Only for new items, set default values based on selected type
    if (creating) {
      const newValue = getDefaultValueForType(data.type);
      data = {
        ...data,
        defaultValue: newValue,
        value: newValue
      };
    }

    if (creating) {
      const payload: Omit<Domotica, "id"> = {...data, id: undefined as unknown as number} as any;
      await onSave(payload, true);
    } else {
      const update: Partial<Domotica> = {...data};
      await onSave(update, false);
    }
  };

  const title = creating ? "Add domotica" : `Edit domotica`;
  if (!domotica) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField label="Name" fullWidth {...field} />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField label="Description" fullWidth {...field} />
            )}
          />
          <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
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
              render={({ field }) => (
                <Select fullWidth size="small" {...field}>
                  {rooms?.map(r => (<MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>))}
                </Select>
              )}
            />
          </Stack>
          <Controller
            name="upc"
            control={control}
            render={({ field }) => (
              <TextField label="UPC" fullWidth {...field} />
            )}
          />
          <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
            <Controller
              name="x"
              control={control}
              render={({ field }) => (
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
              render={({ field }) => (
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          {creating ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}