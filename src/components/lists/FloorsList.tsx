import {Box, CircularProgress, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {useCreateFloor, useDeleteFloor, useFloorsList, useUpdateFloor} from "../../hooks";
import {EditFloorDialog, AddFloorDialog} from "../dialogs/floor";
import {DeleteConfirmDialog} from "../dialogs/DeleteConfirmDialog.tsx";
import {useContext, useState} from "react";
import type {Floor} from "../../model";
import {GeneralContext} from "../../context/GeneralContext.ts";

export interface BuildingFloorsListProps {
  activeFloor: string;
  onFloorChange: (floorNumber: string) => void;
}

export function FloorsList({activeFloor, onFloorChange}: Readonly<BuildingFloorsListProps>) {
  const {floors, isLoading} = useFloorsList();
  const { isAdmin } = useContext(GeneralContext);

  const [addFloorModalOpen, setAddFloorModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Floor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Floor | null>(null);

  const createFloorMutation = useCreateFloor();
  const updateFloorMutation = useUpdateFloor(editTarget?.id || '');
  const deleteFloorMutation = useDeleteFloor(deleteTarget?.id || '');

  const sorted = (floors ?? []).slice().sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id));

  return (
    <Box sx={{width: '100%'}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1}}>
        <Typography variant="h6">Floors</Typography>
        {isAdmin && (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Add floor">
              <IconButton color="primary" size="small" onClick={() => setAddFloorModalOpen(true)}>
                <AddBoxIcon/>
              </IconButton>
            </Tooltip>
          </Stack>
        )}
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
        ) : sorted.length === 0 ? (
          <Stack alignItems="center" sx={{py: 2}}>
            <Typography variant="body2" color="text.secondary">
              No floors available
            </Typography>
          </Stack>
        ) : (
          <Stack>
            {sorted.map((f) => {
              const isActive = f.id === activeFloor;
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
                  onClick={() => {
                    onFloorChange(f.id)
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{fontWeight: isActive ? 600 : 400, cursor: 'pointer'}}
                  >
                    {`Floor ${f.id}: ${f.name}`}
                  </Typography>
                  {isAdmin && (
                    <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Edit floor">
                        <IconButton size="small" onClick={() => isAdmin && setEditTarget(f)}>
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={f.id === '0' ? 'Cannot delete ground floor' : 'Delete floor'}>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => isAdmin && setDeleteTarget(f)}
                          disabled={f.id === '0'}>
                          <DeleteForeverIcon/>
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>

      <AddFloorDialog
        open={addFloorModalOpen}
        onClose={() => setAddFloorModalOpen(false)}
        onSubmit={({ id, name, description, widthMm, heightMm }) => {
          if (!isAdmin) { setAddFloorModalOpen(false); return; }
          createFloorMutation.mutate({ id, name, description, widthMm, heightMm }, {
            onSuccess: (newFloor) => {onFloorChange(newFloor.id);}
          });
        }}
      />

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
          if (!isAdmin) { setEditTarget(null); return; }
          updateFloorMutation.mutate({name, description: description || undefined, widthMm, heightMm});
          setEditTarget(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget || deleteTarget.id === '0') return; // just to be sure
          if (!isAdmin) { setDeleteTarget(null); return; }
          deleteFloorMutation.mutate(undefined, {
              onSuccess: () => {
                setDeleteTarget(null);
                onFloorChange('0');
              }
            }
          )

        }}
        title={deleteTarget?.id === '0' ? 'Cannot delete ground floor' : 'Delete floor'}
        message={deleteTarget ? (deleteTarget.id === '0' ? 'Ground floor (floor 0) cannot be deleted.' : `Are you sure you want to delete floor ${deleteTarget.id}: ${deleteTarget.name}?`) : ''}
        confirmDisabled={deleteTarget?.id === '0' || !isAdmin}
      />
    </Box>
  );
}
