import {SceneDialogBase} from './SceneDialogBase';
import type { Scene } from '../../../model';

export interface EditSceneDialogProps {
  open: boolean;
  scene: Scene | null;
  onClose: () => void;
  onSave?: (payload: Partial<Scene>) => void | Promise<void>;
}

export function EditSceneDialog({ open, scene, onClose, onSave }: Readonly<EditSceneDialogProps>) {
  if (!scene) return null;
  return (
    <SceneDialogBase
      open={open}
      onClose={onClose}
      mode="edit"
      initialValues={{ name: scene.name, description: scene.description, image: scene.image, controls: scene.controls }}
      onSubmit={async (payload) => {
        if (!onSave) return;
        const update: Partial<Scene> = {
          id: scene.id,
          name: payload.name,
          description: payload.description,
          image: payload.image,
          controls: payload.controls,
        };
        await onSave(update);
      }}
      title="Edit scene"
      submitLabel="Save"
    />
  );
}
