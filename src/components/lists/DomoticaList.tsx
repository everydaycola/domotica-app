import {useContext, useState} from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type {Domotica, DomoticaType} from "../../model/domotica.ts";
import {useCreateDomotica, useDeleteDomotica, useDomoticaFiltered, useUpdateDomotica} from "../../hooks/useDomotica.ts";
import {EditValueDialog} from "../dialogs/domotica/EditValueDialog.tsx";
import EditDomoticaDialog from "../dialogs/domotica/EditDomoticaDialog.tsx";
import DeleteConfirmDialog from "../dialogs/DeleteConfirmDialog.tsx";
import {GeneralContext} from "../../context/GeneralContext.ts";
import {typeIcon} from "../dialogs/domotica/DomoticaTypeHelpers.tsx";
import AddDomoticaDialog from "../dialogs/domotica/AddDomoticaDialog.tsx";

export type DomoticaListProps = {
  floorId: string;
  selectedRoomId: number | null;
  clearRoomSelection: () => void;
};

export default function DomoticaList({floorId, selectedRoomId, clearRoomSelection}: Readonly<DomoticaListProps>) {
  const { isAdmin } = useContext(GeneralContext);
  // filtering
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DomoticaType | null>(null);
  const {domotica, isLoading} = useDomoticaFiltered(floorId, selectedRoomId, search, typeFilter);

  // Value editing modal
  const [editingValue, setEditingValue] = useState<Domotica | null>(null);
  const updateValueMutation = useUpdateDomotica(editingValue?.id ?? '0', floorId);

  // create
  const [openCreate, setOpenCreate] = useState(false);
  const createMutation = useCreateDomotica();

  // edit
  const [editingDetails, setEditingDetails] = useState<Domotica | null>(null);
  const updateDetailsMutation = useUpdateDomotica(editingDetails?.id ?? '0', floorId);

  // Deletion confirmation dialog
  const [deleting, setDeleting] = useState<Domotica | null>(null)
  const deleteMutation = useDeleteDomotica(deleting?.id ?? '0', floorId)

  const resetFilters = () => {
    setSearch("");
    setTypeFilter(null);
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
          slotProps={{input: {startAdornment: (<InputAdornment position="start"><SearchIcon/></InputAdornment>),},}}
          sx={{flex: 1}}
        />

        <Select size="small" value={typeFilter ?? "all"} onChange={(e) => setTypeFilter(e.target.value === "all" ? null : e.target.value as DomoticaType)}
                sx={{minWidth: 160}}>
          <MenuItem value="all">All types</MenuItem>
          <MenuItem value="light">Lights</MenuItem>
          <MenuItem value="heating">Heating</MenuItem>
          <MenuItem value="door">Doors</MenuItem>
          <MenuItem value="audio">Audio</MenuItem>
        </Select>
        <Button size="small" onClick={resetFilters}>Reset</Button>
        {isAdmin && (
          <Button variant="contained" size="small" startIcon={<AddIcon/>} onClick={() => {
            setOpenCreate(true);
          }}>Add domotica</Button>
        )}
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
                        isAdmin &&
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit details">
                            <IconButton edge="end" onClick={(e) => {
                              e.stopPropagation();
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

      <EditValueDialog
        open={!!editingValue}
        domoticaTarget={editingValue}
        onClose={() => setEditingValue(null)}
        onSave={(value) => {
          if (!editingValue || !isAdmin) return;
          updateValueMutation.mutate({value}, {onSuccess: () => setEditingValue(null)});
        }}
      />

      <AddDomoticaDialog
        open={openCreate}
        floorId={floorId}
        initialRoomId={selectedRoomId ?? undefined}
        onClose={() => setOpenCreate(false)}
        onCreate={async (payload: Omit<Domotica, "id">) => {
          if (!isAdmin) return;
          await createMutation.mutateAsync(payload);
          setOpenCreate(false);
        }}
      />

      <EditDomoticaDialog
        open={!!editingDetails}
        domotica={editingDetails}
        floorId={floorId}
        onClose={() => setEditingDetails(null)}
        onSave={async (payload) => {
          if (!isAdmin || !editingDetails?.id) return;
          const update = { ...payload } as Partial<Domotica>;
          delete update.id;
          await updateDetailsMutation.mutateAsync(update);
          setEditingDetails(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleting}
        onClose={() => {
          setDeleting(null);
        }}
        onConfirm={() => {
          if (!deleting || deleting.id === '0' || !isAdmin) return;
          deleteMutation.mutate(undefined, {
            onSuccess: () => {
              setDeleting(null);
            }
          })
        }}
        />

    </Box>
  );
}
