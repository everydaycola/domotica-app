import type {
  audioValue,
  Domotica,
  DomoticaValue,
  doorValue,
  heatingValue,
  lightValue
} from "../../../model";
import {useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  Typography
} from "@mui/material";


interface EditValueDialogProps {
  open: boolean;
  domoticaTarget: Domotica | null;
  onClose: () => void;
  onSave: (value: Domotica["value"]) => void;
}

export function EditValueDialog({open, domoticaTarget, onClose, onSave}: Readonly<EditValueDialogProps>) {
  const [local, setLocal] = useState(domoticaTarget?.value ?? ({} as Domotica["value"]));
  if (!domoticaTarget) return null;
  const handleSave = () => onSave(local);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Quick controls — {domoticaTarget.name}</DialogTitle>
      <DialogContent>
        {domoticaTarget.type === "light" && (
          <Stack sx={{mt: 1}}>
            <FormControlLabel control={<Switch checked={(local as lightValue).on ?? false} onChange={(e) => setLocal({
              ...(local as DomoticaValue),
              on: e.target.checked
            })}/>} label={(local as lightValue).on ? "on" : "off"}/>
            <Typography variant="caption">Brightness</Typography>
            <Slider value={(local as lightValue).brightness ?? 100}
                    onChange={(_, val) => setLocal({...(local as lightValue), brightness: val})}
                    step={1} min={0} max={100}
                    valueLabelDisplay="auto"/>
          </Stack>
        )}
        {domoticaTarget.type === "heating" && (
          <Stack sx={{mt: 1}}>
            <Typography variant="caption">Temperature (°C)</Typography>
            <Slider value={(local as heatingValue).temperature ?? 16}
                    onChange={(_, val) => setLocal({...(local as heatingValue), temperature: val})}
                    step={0.5} min={5} max={30}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value.toFixed(1)}/>
          </Stack>
        )}
        {domoticaTarget.type === "door" && (
          <Stack sx={{mt: 1}}>
            <FormControlLabel control={<Switch checked={(local as doorValue).open ?? false} onChange={(e) => setLocal({
              ...(local as doorValue),
              open: e.target.checked
            })}/>} label={(local as doorValue).open ? "on" : "off"}/>
          </Stack>
        )}
        {domoticaTarget.type === "audio" && (
          <Stack sx={{mt: 1}}>
            <Typography variant="caption">Volume</Typography>
            <Slider value={(local as audioValue).volume ?? 0}
                    onChange={(_, val) => setLocal({...(local as audioValue), volume: val})}
                    step={1} min={0} max={100}
                    valueLabelDisplay="auto"/>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}