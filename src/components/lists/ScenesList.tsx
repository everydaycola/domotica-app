import {useContext, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type {Scene} from '../../model';
import {GeneralContext} from '../../context/GeneralContext';
import {useCreateScene, useDeleteScene, useScenes, useTriggerScene, useUpdateScene} from '../../hooks';
import {AddSceneDialog, EditSceneDialog} from '../dialogs/scenes';
import {DeleteConfirmDialog} from '../dialogs/DeleteConfirmDialog';

export function ScenesList() {
  const { isAdmin } = useContext(GeneralContext);
  const { scenes, isLoading } = useScenes();

  const [search, setSearch] = useState('');
  const filtered = (scenes ?? [])
    .filter(s =>
      `${s.name} ${s.description ?? ''}`
        .toLowerCase()
        .includes(
          (search ?? '')
            .trim()
            .toLowerCase()
        )
    );

  // add
  const [openAdd, setOpenAdd] = useState(false);
  const createMutation = useCreateScene();

  // edit
  const [editing, setEditing] = useState<Scene | null>(null);
  const updateMutation = useUpdateScene(editing?.id ?? '0');

  // delete
  const [deleting, setDeleting] = useState<Scene | null>(null);
  const deleteMutation = useDeleteScene(deleting?.id ?? '0');

  // trigger
  const triggerMutation = useTriggerScene();

  return (
    <Box sx={{ width: '100%', maxWidth: 900 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1 }}>
        <TextField
          size="small"
          placeholder="Search name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) } }}
          sx={{ flex: 1 }}
        />
        {isAdmin && (
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
            Add scene
          </Button>
        )}
      </Stack>

      <Divider />

      {isLoading ? (
        <Typography variant="body2" sx={{ mt: 2 }}>Loading scenes…</Typography>
      ) : filtered && filtered.length > 0 ? (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filtered.map((s) => (
            <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined">
                <CardHeader
                  title={s.name}
                  subheader={s.description}
                  action={isAdmin && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setEditing(s)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleting(s)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                />
                {s.image ? (
                  <CardMedia component="img" height="140" image={s.image} alt={s.name} sx={{ objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
                    <Avatar sx={{ width: 64, height: 64 }}>{s.name?.charAt(0).toUpperCase()}</Avatar>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {s.controls?.length ?? 0} control{s.controls?.length === 1 ? '' : 's'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => triggerMutation.mutate(s)}
                    disabled={triggerMutation.isPending}
                  >
                    Trigger
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ mt: 2 }}>No scenes found</Typography>
      )}

      {/* Add */}
      <AddSceneDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreate={async (payload) => {
          if (!isAdmin) return;
          await createMutation.mutateAsync(payload);
          setOpenAdd(false);
        }}
      />

      {/* Edit */}
      <EditSceneDialog
        open={!!editing}
        scene={editing}
        onClose={() => setEditing(null)}
        onSave={async (payload) => {
          if (!isAdmin || !editing?.id) return;
          const update = { ...payload } as Partial<Scene>;
          delete (update).id;
          await updateMutation.mutateAsync(update);
          setEditing(null);
        }}
      />

      {/* Delete */}
      <DeleteConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!isAdmin || !deleting?.id) return;
          deleteMutation.mutate(undefined, { onSuccess: () => setDeleting(null) });
        }}
        title={'Delete scene'}
        message={deleting ? `Are you sure you want to delete scene "${deleting.name}"?` : ''}
      />
    </Box>
  );
}
