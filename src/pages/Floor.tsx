import { useNavigate, useParams } from "react-router-dom";
import CustomAppBar from "../components/appBar/AppBar.tsx";
import ActionsSpeedDial, { type Action } from "../components/actionsSpeedDial/ActionsSpeedDial.tsx";
import { GeneralContext } from "../context/GeneralContext.ts";
import { useContext, useEffect, useState } from "react";
import { BaseFloorPlan } from "../components/floorPlan/BaseFloorPlan.tsx";
import { Box } from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditFloorDialog from "../components/dialogs/EditFloorDialog.tsx";
import AddItemDialog from "../components/dialogs/AddItemDialog.tsx";
import DeleteConfirmDialog from "../components/dialogs/DeleteConfirmDialog.tsx";
import { useCreateFloor, useDeleteFloor, useFloor, useUpdateFloor } from "../../hooks/useFloor.ts";

const actions: Action[] = [
  { icon: <AspectRatioIcon />, name: "Edit" },
  { icon: <AddBoxIcon />, name: "Add" },
  { icon: <DeleteForeverIcon />, name: "Delete" },
];

export function Floor() {
  const navigate = useNavigate();
  const { id: floorNumber } = useParams();
  const { setFloorNumber } = useContext(GeneralContext);
  const { floor, isLoading, isError } = useFloor(floorNumber!);

    const isGroundFloor = floorNumber === "0";

    const updateFloorMutation = useUpdateFloor(floorNumber!);
    const createFloorMutation = useCreateFloor();
    const deleteFloorMutation = useDeleteFloor(floorNumber!);

    useEffect(() => {
        setFloorNumber(floorNumber ? floorNumber : "1");
    }, [floorNumber, setFloorNumber]);

  const [openDialog, setOpenDialog] = useState<null | "Edit" | "Add" | "Delete">(null);

  const handleAction = (name: string) => {
    if (name === "Edit" || name === "Add" || name === "Delete") {
      setOpenDialog(name);
    }
  };

  const closeDialog = () => setOpenDialog(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !floor) return <div>Error</div>;

  return (
    <>
      <CustomAppBar />

      <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
        <BaseFloorPlan ratio={floor.ratio} />
        <ActionsSpeedDial actions={actions} onAction={handleAction} />
      </Box>

      <EditFloorDialog
        open={openDialog === "Edit"}
        onClose={closeDialog}
        initialRatio={floor.ratio}
        onSubmit={({ ratio }) => {
          updateFloorMutation.mutate({ ratio });
        }}
      />

      <AddItemDialog
        open={openDialog === "Add"}
        onClose={closeDialog}
        onSubmit={({ id, ratio }) => {
          createFloorMutation.mutate({ id, ratio }, {
            onSuccess: (newFloor) => {
              navigate(`/floor/${newFloor.id}`);
            }
          });
        }}
      />

      <DeleteConfirmDialog
        open={openDialog === "Delete"}
        onClose={closeDialog}
        onConfirm={() => {
          if (isGroundFloor) return; // just to be sure
          deleteFloorMutation.mutate(undefined, {
            onSuccess: () => {
              navigate('/floor/0');
            }
          });
        }}
        title={isGroundFloor ? 'Cannot delete ground floor' : 'Delete floor'}
        message={isGroundFloor ? 'Ground floor (floor 0) cannot be deleted.' : `Are you sure you want to delete floor ${floorNumber}?`}
        confirmDisabled={isGroundFloor}
      />
    </>
  );
}
