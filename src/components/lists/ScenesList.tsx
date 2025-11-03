import {useContext, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
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
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type {Scene} from '../../model';
import {GeneralContext} from '../../context/GeneralContext';
import {
  useCreateScene,
  useDeleteScene,
  useTriggerScene,
  useUpdateScene,
  cronToString,
  useEventScheduler, getFilteredAndSortedScenes
} from '../../hooks';
import {AddSceneDialog, EditSceneDialog} from '../dialogs/scenes';
import {DeleteConfirmDialog} from '../dialogs/DeleteConfirmDialog';

export type ScenesListProps = {
  scenes: Scene[]
};




export function ScenesList({scenes}: Readonly<ScenesListProps>) {
  const {isAdmin} = useContext(GeneralContext);
  const [search, setSearch] = useState('');
  const filtered = getFilteredAndSortedScenes(scenes, search);

  const [openAdd, setOpenAdd] = useState(false);
  const createMutation = useCreateScene();

  const [editing, setEditing] = useState<Scene | null>(null);
  const updateMutation = useUpdateScene(editing?.id ?? '0');

  const [deleting, setDeleting] = useState<Scene | null>(null);
  const deleteMutation = useDeleteScene(deleting?.id ?? '0');

  const triggerMutation = useTriggerScene();

  return (
    <Box sx={{width: '100%', maxWidth: 900}}>
      <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} sx={{mb: 1}}>
        <TextField
          size="small"
          placeholder="Search name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{input: {startAdornment: (<InputAdornment position="start"><SearchIcon/></InputAdornment>)}}}
          sx={{flex: 1}}
        />
        <Button variant="contained" size="small" startIcon={<AddIcon/>} onClick={() => setOpenAdd(true)}>
          Add scene
        </Button>
      </Stack>

      <Divider/>

      <Grid container spacing={2} sx={{mt: 1}}>
        {filtered.map((s) => (
          <Grid key={s.id} size={{xs: 12, sm: 6, md: 4}}>
            <Card variant="outlined">

              <Box sx={{p: 2}}>
                <Typography variant="h6" component="div">
                  {s.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FavoriteSceneButton sceneId={s.id} favorite={!!s.favorite}/>
                  <Tooltip
                    title={s.isCustom ? 'Custom scene: You can edit/delete this.' : 'Default scene: Only admins can edit/delete.'}>
                        <span>
                          {s.isCustom ? (
                            <PersonIcon fontSize="small" color="primary"/>
                          ) : (
                            <LockIcon fontSize="small" color="action"/>
                          )}
                        </span>
                  </Tooltip>
                  <Tooltip title={(!isAdmin && !s.isCustom) ? 'Default scene: Only admins can edit.' : 'Edit'}>
                        <span>
                          <IconButton size="small" onClick={() => setEditing(s)} disabled={!isAdmin && !s.isCustom}>
                            <EditIcon fontSize="small"/>
                          </IconButton>
                        </span>
                  </Tooltip>
                  <Tooltip title={(!isAdmin && !s.isCustom) ? 'Default scene: Only admins can delete.' : 'Delete'}>
                        <span>
                          <IconButton size="small" color="error" onClick={() => setDeleting(s)}
                                      disabled={!isAdmin && !s.isCustom}>
                            <DeleteIcon fontSize="small"/>
                          </IconButton>
                        </span>
                  </Tooltip>
                </Stack>
                {s.description && (
                  <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                    {s.description}
                  </Typography>
                )}
              </Box>
              {s.image ? (
                <CardMedia component="img" height="140" image={s.image} alt={s.name} sx={{objectFit: 'cover'}}/>
              ) : (
                <Box sx={{
                  height: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover'
                }}>
                  <Avatar sx={{width: 64, height: 64}}>{s.name?.charAt(0).toUpperCase()}</Avatar>
                </Box>
              )}
              <CardContent>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    {s.controls?.length ?? 0} control{s.controls?.length === 1 ? '' : 's'}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon fontSize="small" color={s.schedule ? 'action' : 'disabled'}/>
                    <Typography variant="caption" color="text.secondary">
                      {cronToString(s.schedule ?? null)}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<PlayArrowIcon/>}
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

      {/* Add */}
      <AddSceneDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreate={async (payload) => {
          const nowIso = new Date().toISOString();
          await createMutation.mutateAsync({...payload, favorite: false, lastTrigger: nowIso});
          setOpenAdd(false);
        }}
      />

      {/* Edit */}
      <EditSceneDialog
        open={!!editing}
        scene={editing}
        onClose={() => setEditing(null)}
        onSave={async (payload) => {
          if (!editing?.id) return;
          const update = {...payload} as Partial<Scene>;
          delete (update).id;
          const nowIso = new Date().toISOString();
          await updateMutation.mutateAsync({...update, lastTrigger: nowIso});
          setEditing(null);
        }}
      />

      {/* Delete */}
      <DeleteConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting?.id) return;
          deleteMutation.mutate(undefined, {onSuccess: () => setDeleting(null)});
        }}
        title={'Delete scene'}
        message={deleting ? `Are you sure you want to delete scene "${deleting.name}"?` : ''}
      />

      {/* Invisible auto schedulers */}
      {(scenes ?? []).map((s) => (
        <SceneAutoScheduler key={s.id} scene={s}/>
      ))}
    </Box>
  );
}

function FavoriteSceneButton({sceneId, favorite}: Readonly<{
  sceneId: string;
  favorite: boolean | undefined;
}>) {
  const update = useUpdateScene(sceneId);
  return (
    <Tooltip title={favorite ? 'Unfavorite' : 'Mark favorite'}>
      <span>
        <IconButton
          size="small"
          color={favorite ? 'warning' : 'default'}
          onClick={(e) => {
            e.stopPropagation();
            update.mutate({favorite: !favorite});
          }}
          disabled={update.isPending}
        >
          {favorite ? <StarIcon fontSize="small"/> : <StarBorderIcon fontSize="small"/>}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function SceneAutoScheduler({scene}: Readonly<{ scene: Scene }>) {
  const trigger = useTriggerScene();
  // If no schedule, use an impossible minute value to never trigger
  const effectiveSchedule = scene.schedule ?? {
    minute: '61', // never matches 0-59
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  };

  // can't call a hook conditionally, so we use an impossible schedule to never trigger
  useEventScheduler(effectiveSchedule, () => {
    if (trigger.isPending) return;
    trigger.mutate(scene);
  });

  return null;
}
