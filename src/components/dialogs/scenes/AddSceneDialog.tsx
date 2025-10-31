import SceneDialogBase from './SceneDialogBase';
import type { Scene } from '../../../model/scene';

export interface AddSceneDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (payload: Omit<Scene, 'id'>) => void | Promise<void>;
}

export default function AddSceneDialog({ open, onClose, onCreate }: Readonly<AddSceneDialogProps>) {
  return (
    <SceneDialogBase
      open={open}
      onClose={onClose}
      mode="add"
      initialValues={{ name: '', description: '', image: '', controls: [] }}
      onSubmit={async (payload) => {
        if (onCreate) await onCreate(payload);
      }}
      title="Add scene"
      submitLabel="Create"
    />
  );
}
