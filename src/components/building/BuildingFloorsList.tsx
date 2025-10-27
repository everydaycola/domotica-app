import {Box, Stack, Typography, IconButton, Tooltip, CircularProgress} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {useNavigate, useParams} from "react-router-dom";
import {useDeleteFloor, useFloorsList, useUpdateFloor} from "../../hooks/useFloor";
import EditFloorDialog from "../dialogs/EditFloorDialog";
import DeleteConfirmDialog from "../dialogs/DeleteConfirmDialog";
import {useState} from "react";
import type {Floor} from "../../model/floor";

export interface BuildingFloorsListProps {
  onAdd?: () => void;
}

export default function BuildingFloorsList({onAdd}: Readonly<BuildingFloorsListProps>) {
  const navigate = useNavigate();
  const {id: currentId} = useParams();
  const {floors, isLoading} = useFloorsList();

  const [editTarget, setEditTarget] = useState<Floor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Floor | null>(null);

  const updateFloorMutation = useUpdateFloor(editTarget?.id || '');
  const deleteFloorMutation = useDeleteFloor(deleteTarget?.id || '');

  const sorted = (floors ?? []).slice().sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id));

  return (
    <Box sx={{width: '100%'}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1}}>
        <Typography variant="h6">Floors</Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Add floor">
            <IconButton color="primary" size="small" onClick={onAdd}>
              <AddBoxIcon/>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Box sx={{
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: 1,
        px: 1,
        py: 1,
        backgroundColor: 'background.paper'
      }}>
        {isLoading ? (
          <Stack alignItems="center" sx={{py: 3}}>
            <CircularProgress size={24}/>
          </Stack>
        ) : (
          <Stack>
            {sorted.map((f) => {
              const isActive = f.id === currentId;
              return (
                <Box
                  key={f.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid',
                    borderColor: isActive ? 'primary.main' : 'divider',
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 0.5,
                    px: 1,
                    py: 0.75,
                    mb: 0.5,
                  }}
                  onClick={() => navigate(`/floor/${f.id}`)}
                >
                  <Typography
                    variant="body2"
                    sx={{fontWeight: isActive ? 600 : 400, cursor: 'pointer'}}
                  >
                    {`Floor ${f.id}: ${f.name}`}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit floor">
                      <IconButton size="small" onClick={() => setEditTarget(f)}>
                        <EditIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={f.id === '0' ? 'Cannot delete ground floor' : 'Delete floor'}>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteTarget(f)}
                        disabled={f.id === '0'}>
                        <DeleteForeverIcon/>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>

      {/* Edit Floor Dialog */}
      <EditFloorDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        initialValues={editTarget ? {
          name: editTarget.name,
          description: editTarget.description ?? '',
          widthMm: editTarget.widthMm,
          heightMm: editTarget.heightMm,
        } : {name: '', description: '', widthMm: 0, heightMm: 0}}
        onSubmit={({name, description, widthMm, heightMm}) => {
          if (!editTarget) return;
          updateFloorMutation.mutate({ name, description: description || undefined, widthMm, heightMm });
          setEditTarget(null);
        }}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget || deleteTarget.id === '0') return; // just to be sure
          deleteFloorMutation.mutate( undefined, {
              onSuccess: () => {
                navigate('/floor/0');
              }
            }
          )
          setDeleteTarget(null);
        }}
        title={deleteTarget?.id === '0' ? 'Cannot delete ground floor' : 'Delete floor'}
        message={deleteTarget ? (deleteTarget.id === '0' ? 'Ground floor (floor 0) cannot be deleted.' : `Are you sure you want to delete floor ${deleteTarget.id}: ${deleteTarget.name}?`) : ''}
        confirmDisabled={deleteTarget?.id === '0'}
      />
    </Box>
  );
}
