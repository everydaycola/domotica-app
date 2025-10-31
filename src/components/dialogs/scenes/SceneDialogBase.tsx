import {useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Slider,
} from '@mui/material';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useAllDomotica} from '../../../hooks';
import type {Domotica, DomoticaValue, lightValue, heatingValue, doorValue, audioValue, Scene, SceneControl} from '../../../model';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@mui/icons-material/Search";

export interface SceneDialogBaseProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialValues?: Omit<Scene, 'id' | 'floorId'>;
  onSubmit: (payload: Omit<Scene, 'id'>) => void | Promise<void>;
  title?: string;
  submitLabel?: string;
}

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type SceneFormValues = z.input<typeof schema>;

function ValueEditor({type, value, onChange}: Readonly<{
  type: Domotica['type'];
  value: DomoticaValue;
  onChange: (v: DomoticaValue) => void
}>) {
  switch (type) {
    case 'light': {
      const v = value as lightValue;
      return (
        <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems="center" sx={{flex: 1}}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption">On</Typography>
            <Switch checked={v.on ?? false} onChange={(e) => onChange({...v, on: e.target.checked})}/>
          </Stack>
          <Stack sx={{flex: 1}}>
            <Typography variant="caption">Brightness</Typography>
            <Slider min={0} max={100} step={1} value={v.brightness ?? 100}
                    onChange={(_, val) => onChange({...v, brightness: val})} valueLabelDisplay="auto"/>
          </Stack>
        </Stack>
      );
    }
    case 'heating': {
      const v = value as heatingValue;
      return (
        <Stack sx={{flex: 1}}>
          <Typography variant="caption">Temperature (°C)</Typography>
          <Slider min={5} max={30} step={0.5} value={v.temperature ?? 16}
                  onChange={(_, val) => onChange({...v, temperature: val})} valueLabelDisplay="auto"
                  valueLabelFormat={(value) => (value).toFixed(1)}/>
        </Stack>
      );
    }
    case 'door': {
      const v = value as doorValue;
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption">Open</Typography>
          <Switch checked={v.open ?? false} onChange={(e) => onChange({...v, open: e.target.checked})}/>
        </Stack>
      );
    }
    case 'audio':
    default: {
      const v = value as audioValue;
      return (
        <Stack sx={{flex: 1}}>
          <Typography variant="caption">Volume</Typography>
          <Slider min={0} max={100} step={1} value={v.volume ?? 0}
                  onChange={(_, val) => onChange({...v, volume: val})} valueLabelDisplay="auto"/>
        </Stack>
      );
    }
  }
}

export function SceneDialogBase(
  {
    open,
    onClose,
    mode,
    initialValues,
    onSubmit,
    title,
    submitLabel
  }: Readonly<SceneDialogBaseProps>) {
  const isAdd = mode === 'add';
  const {domotica} = useAllDomotica();

  const {register, handleSubmit, formState: {errors}, reset} = useForm<SceneFormValues>({
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      image: initialValues?.image ?? '',
    },
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const defaultControlValue = (d: Domotica): DomoticaValue => {
    switch (d.type) {
      case 'light':
        return {on: false, brightness: 100} as lightValue;
      case 'heating':
        return {temperature: 16} as heatingValue;
      case 'door':
        return {open: false} as doorValue;
      case 'audio':
      default:
        return {volume: 0} as audioValue;
    }
  }

  const [controls, setControls] = useState<SceneControl[]>(initialValues?.controls ?? []);

  if (open) {
    reset({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      image: initialValues?.image ?? '',
    });
    setControls(initialValues?.controls ?? []);
  }

  const addControl = () => {
    const first = domotica?.[0];
    if (!first) return;
    setControls((prev) => [...prev, {domoticaId: first.id, value: defaultControlValue(first)}]);
  };

  const updateControl = (idx: number, patch: Partial<SceneControl>) => {
    setControls((prev) => prev.map((c, i) => i === idx ? {...c, ...patch} : c));
  };

  const removeControl = (idx: number) => {
    setControls((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (values: SceneFormValues) => {
    const payload: Omit<Scene, 'id'> = {
      name: values.name,
      description: values.description?.trim() || undefined,
      image: values.image?.trim() || undefined,
      controls,
    };
    await onSubmit(payload);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // reset after close
    reset({name: '', description: '', image: ''});
    setControls([]);
  };

  const resolvedTitle = title ?? (isAdd ? 'Add scene' : 'Edit scene');
  const resolvedSubmit = submitLabel ?? (isAdd ? 'Create' : 'Save');

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{resolvedTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}} component="form" id={isAdd ? 'add-scene-form' : 'edit-scene-form'}
               onSubmit={handleSubmit(submit)}>
          <TextField label="Name" fullWidth required error={!!errors.name}
                     helperText={errors.name?.message} {...register('name')} />
          <TextField label="Description" fullWidth error={!!errors.description}
                     helperText={errors.description?.message} {...register('description')} />
          <TextField label="Image URL" fullWidth error={!!errors.image}
                     helperText={errors.image?.message} {...register('image')}
                     slotProps={{
                       input: {
                         startAdornment: (<InputAdornment position="start"><SearchIcon/></InputAdornment>),
                       },
                     }}/>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1">Controls</Typography>
            <Button startIcon={<AddIcon/>} onClick={addControl} disabled={!domotica || domotica.length === 0}>Add
              control</Button>
          </Stack>

          {controls.length === 0 && (
            <Typography variant="body2" color="text.secondary">No controls yet. Add one to configure domotica values for
              this scene.</Typography>
          )}

          <Stack spacing={2}>
            {controls.map((c, idx) => {
              const selected = domotica?.find(d => String(d.id) === String(c.domoticaId));
              return (
                <Stack key={idx} direction={{xs: 'column', md: 'row'}} spacing={2} alignItems="center"
                       sx={{p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1}}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={String(c.domoticaId)}
                      onChange={(e) => {
                        const next = domotica?.find(d => String(d.id) === String(e.target.value));
                        if (next) updateControl(idx, {domoticaId: String(next.id), value: defaultControlValue(next)});
                      }}
                      displayEmpty
                    >
                      {domotica?.map(d => (
                        <MenuItem key={d.id} value={String(d.id)}>
                          {d.name} — {d.type}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Select domotica</FormHelperText>
                  </FormControl>

                  {selected && (
                    <ValueEditor type={selected.type} value={c.value} onChange={(v) => updateControl(idx, {value: v})}/>
                  )}

                  <IconButton color="error" onClick={() => removeControl(idx)} aria-label="remove control">
                    <DeleteIcon/>
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit"
                form={isAdd ? 'add-scene-form' : 'edit-scene-form'}>{resolvedSubmit}</Button>
      </DialogActions>
    </Dialog>
  );
}
