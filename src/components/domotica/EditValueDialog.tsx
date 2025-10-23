import {useMemo, useState} from "react";
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
import type {audioValue, Domotica, DomoticaValue, doorValue, heatingValue, lightValue} from "../../model/domotica";

export function EditValueDialog({ open, domotica, onClose, onSave }: {
    open: boolean;
    domotica: Domotica | null;
    onClose: () => void;
    onSave: (value: Domotica["value"]) => void;
}) {
    const [local, setLocal] = useState(domotica?.value ?? ({} as Domotica["value"]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  //  todo remove useMemo
    useMemo(() => setLocal(domotica?.value ?? ({} as Domotica["value"])), [domotica?.id]);
    if (!domotica) return null;
    const handleSave = () => onSave(local);
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Quick controls — {domotica.name}</DialogTitle>
            <DialogContent>
                {domotica.type === "light" && (
                    <Stack sx={{ mt: 1 }}>
                        <FormControlLabel control={<Switch checked={(local as lightValue).on ?? false} onChange={(e) => setLocal({ ...(local as DomoticaValue), on: e.target.checked })} />} label="On" />
                        <Typography variant="caption">Brightness</Typography>
                        <Slider value={(local as lightValue).brightness ?? 100}
                                onChange={(_, val) => setLocal({...(local as lightValue), brightness: val})} step={1}
                                min={0} max={100} valueLabelDisplay="auto"/>
                    </Stack>
                )}
                {domotica.type === "heating" && (
                    <Stack sx={{ mt: 1 }}>
                        <Typography variant="caption">Temperature (°C)</Typography>
                        
                        <Slider value={(local as heatingValue).temperature ?? 16}
                                onChange={(_, val) => setLocal({...(local as heatingValue), temperature: val})}
                                step={0.5} min={5} max={30} valueLabelDisplay="auto"
                                valueLabelFormat={(value) => value.toFixed(1)}/>
                    </Stack>
                )}
                {domotica.type === "door" && (
                    <Stack sx={{ mt: 1 }}>
                        <FormControlLabel control={<Switch checked={(local as doorValue).open ?? false} onChange={(e) => setLocal({ ...(local as doorValue), open: e.target.checked })} />} label="Open" />
                    </Stack>
                )}
                {domotica.type === "audio" && (
                    <Stack sx={{ mt: 1 }}>
                        <Typography variant="caption">Volume</Typography>
                        <Slider value={(local as audioValue).volume ?? 0}
                                onChange={(_, val) => setLocal({...(local as audioValue), volume: val})} step={1}
                                min={0} max={100} valueLabelDisplay="auto"/>
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