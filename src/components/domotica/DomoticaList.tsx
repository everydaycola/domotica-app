import {useMemo, useState} from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import SpeakerIcon from "@mui/icons-material/Speaker";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type {Domotica, DomoticaType, DomoticaValue} from "../../model/domotica";
import {useCreateDomotica, useDeleteDomotica, useDomoticaFiltered, useUpdateDomotica} from "../../hooks/useDomotica";
import {EditValueDialog} from "../dialogs/EditValueDialog.tsx";
import {DomoticaDetailsDialog} from "../dialogs/DomoticaDetailsDialog.tsx";
import DeleteConfirmDialog from "../dialogs/DeleteConfirmDialog.tsx";

export type DomoticaListProps = {
  floorId: string;
  selectedRoomId: number | null;
  clearRoomSelection?: () => void; // optional callback to clear selection in parent
};

function typeIcon(type: DomoticaType) {
  switch (type) {
    case "light":
      return <LightbulbOutlinedIcon/>;
    case "heating":
      return <ThermostatIcon/>;
    case "door":
      return <DoorFrontIcon/>;
    case "audio":
      return <SpeakerIcon/>;
    default:
      return <Avatar/>;
  }
}

export default function DomoticaList({floorId, selectedRoomId, clearRoomSelection}: Readonly<DomoticaListProps>) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DomoticaType | "all">("all");
  // todo: remove useMemo
  const selectedTypes = useMemo<DomoticaType[] | undefined>(() => (typeFilter === "all" ? undefined : [typeFilter]), [typeFilter]);

  const {domotica, isLoading} = useDomoticaFiltered(floorId, {
    roomId: selectedRoomId ?? undefined,
    search,
    types: selectedTypes,
  });

  // Value editing modal
  const [editingValue, setEditingValue] = useState<Domotica | null>(null);
  const updateValueMutation = useUpdateDomotica(editingValue?.id ?? '0', floorId);

  // Details editing/creating modal
  const [editingDetails, setEditingDetails] = useState<Domotica | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const createMutation = useCreateDomotica();
  const updateDetailsMutation = useUpdateDomotica(editingDetails?.id ?? '0', floorId);

  // Deletion confirmation dialog
  const [deleting, setDeleting] = useState<Domotica | null>(null)
  const deleteMutation = useDeleteDomotica(deleting?.id ?? '0', floorId)

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    clearRoomSelection?.();
  };

  return (
    <Box sx={{width: "100%", maxWidth: 900}}>
      <Stack direction={{xs: "column", sm: "row"}} spacing={1} sx={{mb: 1}}>
        <TextField
          size="small"
          placeholder="Search name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon/></InputAdornment>)}}
          sx={{flex: 1}}
        />
        <Select size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
                sx={{minWidth: 160}}>
          <MenuItem value="all">All types</MenuItem>
          <MenuItem value="light">Lights</MenuItem>
          <MenuItem value="heating">Heating</MenuItem>
          <MenuItem value="door">Doors</MenuItem>
          <MenuItem value="audio">Audio</MenuItem>
        </Select>
        <Button size="small" onClick={resetFilters}>Reset</Button>
        <Button variant="contained" size="small" startIcon={<AddIcon/>} onClick={() => {
          setCreating(true);
          setEditingDetails({
            id: '0',
            floorId,
            roomId: selectedRoomId ?? 0,
            name: "",
            description: "",
            type: "light",
            upc: "",
            defaultValue: {on: false, brightness: 100} as DomoticaValue,
            value: {on: false, brightness: 100} as DomoticaValue,
            x: 0,
            y: 0,
          } as Domotica);
        }}>Add domotica</Button>
      </Stack>

      <Divider/>
      {isLoading ? (
        <Typography variant="body2" sx={{mt: 2}}>Loading domotica…</Typography>
      ) : domotica && domotica.length > 0 ? (
        <List>
          {domotica.map((d) => (
            <ListItem key={d.id}
                      component="div"
                      disableGutters
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit details">
                            <IconButton edge="end" onClick={(e) => {
                              e.stopPropagation();
                              setCreating(false);
                              setEditingDetails(d);
                            }}>
                              <EditIcon/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton edge="end" color="error" onClick={(e) => {
                              e.stopPropagation();
                              setDeleting(d);
                            }}>
                              <DeleteIcon/>
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
            >
              <ListItemButton onClick={() => setEditingValue(d)}>
                <ListItemAvatar>
                  <Avatar>
                    {typeIcon(d.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" gap={1} alignItems="center">
                      <Typography sx={{cursor: "pointer"}}>{d.name}</Typography>
                      <Chip size="small" label={d.type}/>
                    </Stack>
                  }
                  secondary={d.description}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{mt: 2}}>No domotica found</Typography>
      )}

      {/* Value dialog (quick controls) */}
      <EditValueDialog
        open={!!editingValue}
        domotica={editingValue}
        onClose={() => setEditingValue(null)}
        onSave={(value) => {
          if (!editingValue) return;
          updateValueMutation.mutate({value}, {onSuccess: () => setEditingValue(null)});
        }}
      />

      {/* Details create/edit dialog */}
      <DomoticaDetailsDialog
        open={!!editingDetails}
        domotica={editingDetails}
        floorId={floorId}
        onClose={() => {
          setEditingDetails(null);
          setCreating(false);
        }}
        onSave={async (payload, isCreate) => {
          if (isCreate) {
            await createMutation.mutateAsync(payload as Omit<Domotica, "id">);
          } else if (payload && editingDetails?.id) {
            const update = {...payload} as Partial<Domotica>;
            delete (update as any).id;
            await updateDetailsMutation.mutateAsync(update as any);
          }
          setCreating(false);
          setEditingDetails(null);
        }}
        creating={creating}
      />

      {/* Delete confirmation*/}
      <DeleteConfirmDialog
        open={!!deleting}
        onClose={() => {
          setDeleting(null);
        }}
        onConfirm={() => {
          if (!deleting || deleting.id === '0') return;
          deleteMutation.mutate(undefined, {})
        }}
        />

    </Box>
  );
}
