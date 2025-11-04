import {useContext} from 'react';
import {SceneDialogBase} from './SceneDialogBase';
import type { Scene } from '../../../model';
import {GeneralContext} from '../../../context/GeneralContext';

export interface AddSceneDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: Omit<Scene, 'id' | 'isCustom'>) => void | Promise<void>;
}

export function AddSceneDialog({ open, onClose, onCreate }: Readonly<AddSceneDialogProps>) {
  const { isAdmin } = useContext(GeneralContext);
  return (
    <SceneDialogBase
      open={open}
      onClose={onClose}
      mode="add"
      initialValues={{ name: '', description: '', image: '', controls: [], schedule: null }}
      onSubmit={async (payload) => {
        if (onCreate) await onCreate(payload);
      }}
      title="Add scene"
      submitLabel="Create"
      canSchedule={isAdmin}
    />
  );
}
