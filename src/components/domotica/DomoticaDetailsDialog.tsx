import {useState} from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import type {audioValue, Domotica, DomoticaType, doorValue, heatingValue, lightValue} from "../../model/domotica";
import {useRooms} from "../../hooks/useRooms";

export function DomoticaDetailsDialog({ open, domotica, floorId, onClose, onSave, onDelete, creating }: {
    open: boolean;
    domotica: Domotica | null;
    floorId: string;
    onClose: () => void;
    onSave: (payload: Partial<Domotica> | Omit<Domotica, "id">, isCreate: boolean) => Promise<void> | void;
    onDelete: (domotica: Domotica | null) => Promise<void> | void;
    creating: boolean;
}) {
    const { rooms } = useRooms(floorId);
    const initial = domotica ?? ({} as Domotica);
    const [local, setLocal] = useState({
        id: initial.id,
        floorId: initial.floorId ?? floorId,
        roomId: initial.roomId ?? (rooms?.[0]?.id ?? 0),
        name: initial.name ?? "",
        description: initial.description ?? "",
        type: initial.type ?? ("light" as DomoticaType),
        upc: initial.upc ?? "",
        x: initial.x ?? 0,
        y: initial.y ?? 0,
        defaultValue: initial.defaultValue ?? ({ on: false, brightness: 100 } as any),
        value: initial.value ?? ({ on: false, brightness: 100 } as any),
    } as Domotica);

    // update defaults when type changes for newly created items
    const handleTypeChange = (t: DomoticaType) => {
        setLocal((prev) => ({
            ...prev,
            type: t,
            defaultValue:
                t === "light" ? ({ on: false, brightness: 100 } as lightValue) :
                    t === "heating" ? ({ temperature: 16 } as heatingValue) :
                        t === "door" ? ({ open: false } as doorValue) :
                            ({ volume: 0 } as audioValue),
            value:
                t === "light" ? ({ on: false, brightness: 100 } as lightValue) :
                    t === "heating" ? ({ temperature: 16 } as heatingValue) :
                        t === "door" ? ({ open: false } as doorValue) :
                            ({ volume: 0 } as audioValue),
        }));
    };

    const handleSave = async () => {
        if (creating) {
            const payload: Omit<Domotica, "id"> = { ...local, id: undefined as unknown as number } as any;
            await onSave(payload, true);
        } else {
            const update: Partial<Domotica> = { ...local };
            await onSave(update, false);
        }
    };

    const title = creating ? "Add domotica" : `Edit domotica`;
    if (!domotica) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField label="Name" value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} fullWidth />
                    <TextField label="Description" value={local.description ?? ""} onChange={(e) => setLocal({ ...local, description: e.target.value })} fullWidth />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Select fullWidth size="small" value={local.type} onChange={(e) => handleTypeChange(e.target.value as DomoticaType)}>
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="heating">Heating</MenuItem>
                            <MenuItem value="door">Door</MenuItem>
                            <MenuItem value="audio">Audio</MenuItem>
                        </Select>
                        <Select fullWidth size="small" value={local.roomId} onChange={(e) => setLocal({ ...local, roomId: Number(e.target.value) })}>
                            {rooms?.map(r => (<MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>))}
                        </Select>
                    </Stack>
                    <TextField label="UPC" value={local.upc} onChange={(e) => setLocal({ ...local, upc: e.target.value })} fullWidth />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField label="X (mm)" type="number" value={local.x} onChange={(e) => setLocal({ ...local, x: Number(e.target.value) })} fullWidth />
                        <TextField label="Y (mm)" type="number" value={local.y} onChange={(e) => setLocal({ ...local, y: Number(e.target.value) })} fullWidth />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                {!creating && (
                    <Button color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(domotica)}>Delete</Button>
                )}
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>{creating ? "Create" : "Save"}</Button>
            </DialogActions>
        </Dialog>
    );
}