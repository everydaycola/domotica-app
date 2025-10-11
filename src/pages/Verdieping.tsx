import { useParams } from "react-router-dom";
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

const actions: Action[] = [
  { icon: <AspectRatioIcon />, name: "Edit" },
  { icon: <AddBoxIcon />, name: "Add" },
  { icon: <DeleteForeverIcon />, name: "Delete" },
];

export function Verdieping() {
  const { id: floor } = useParams();
  const { setFloor } = useContext(GeneralContext);

  useEffect(() => {
    setFloor(floor ? parseInt(floor) : 1);
  }, [floor, setFloor]);

  const [openDialog, setOpenDialog] = useState<null | "Edit" | "Add" | "Delete">(null);

  const handleAction = (name: string) => {
    if (name === "Edit" || name === "Add" || name === "Delete") {
      setOpenDialog(name);
    }
  };

  const closeDialog = () => setOpenDialog(null);

  return (
    <>
      <CustomAppBar />

      <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
        <BaseFloorPlan />
        <ActionsSpeedDial actions={actions} onAction={handleAction} />
      </Box>

      <EditFloorDialog open={openDialog === "Edit"} onClose={closeDialog} />
      <AddItemDialog open={openDialog === "Add"} onClose={closeDialog} />
      <DeleteConfirmDialog open={openDialog === "Delete"} onClose={closeDialog} />
    </>
  );
}
