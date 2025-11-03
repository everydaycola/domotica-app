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
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import type {Domotica, DomoticaType} from "../../model";
import {useCreateDomotica, useDeleteDomotica, useDomoticaFiltered, useUpdateDomotica} from "../../hooks";
import {EditValueDialog, typeIcon, EditDomoticaDialog, AddDomoticaDialog} from "../dialogs/domotica";
import {DeleteConfirmDialog} from "../dialogs/DeleteConfirmDialog.tsx";
import {GeneralContext} from "../../context/GeneralContext.ts";

export type DomoticaListProps = {
  floorId: string;
  selectedRoomId: number | null;
  clearRoomSelection: () => void;
};

export function DomoticaList({floorId, selectedRoomId, clearRoomSelection}: Readonly<DomoticaListProps>) {
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
                        <Stack direction="row" spacing={1}>
                          <FavoriteDomoticaButton id={d.id} floorId={floorId} favorite={!!d.favorite}/>
                          {isAdmin && (
                            <>
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
                            </>
                          )}
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
          updateValueMutation.mutate({ value, lastChange: new Date().toISOString() }, { onSuccess: () => setEditingValue(null) });
        }}
      />

      <AddDomoticaDialog
        open={openCreate}
        floorId={floorId}
        initialRoomId={selectedRoomId ?? undefined}
        onClose={() => setOpenCreate(false)}
        onCreate={async (payload: Omit<Domotica, "id">) => {
          if (!isAdmin) return;
          const nowIso = new Date().toISOString();
          await createMutation.mutateAsync({ ...payload, favorite: false, lastChange: nowIso });
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
          const nowIso = new Date().toISOString();
          await updateDetailsMutation.mutateAsync({ ...update, lastChange: nowIso });
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

function FavoriteDomoticaButton({ id, floorId, favorite }: Readonly<{
  id: string;
  floorId: string;
  favorite: boolean | undefined;
}>) {
  const update = useUpdateDomotica(id, floorId);
  return (
    <Tooltip title={favorite ? 'Unfavorite' : 'Mark favorite'}>
      <span>
        <IconButton
          edge="end"
          size="small"
          color={favorite ? 'warning' : 'default'}
          onClick={(e) => {
            e.stopPropagation();
            update.mutate({ favorite: !favorite });
          }}
          disabled={update.isPending}
        >
          {favorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
