import {useParams} from "react-router-dom";
import CustomAppBar from "../components/appBar/AppBar.tsx";
import ActionsSpeedDial from "../components/actionsSpeedDial/ActionsSpeedDial.tsx";
import {GeneralContext} from "../context/GeneralContext.ts";
import {type JSX, useContext} from "react";
import {BaseFloorPlan} from "../components/floorPlan/BaseFloorPlan.tsx";
import {Box} from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as React from "react";

export interface action {
    icon: JSX.Element
    name: string
}

const actions: action[] = [
    {icon: <AspectRatioIcon/>, name: 'Edit'},
    {icon: <AddBoxIcon/>, name: 'Add'},
    {icon: <DeleteForeverIcon/>, name: 'Delete'},
];

export function Verdieping() {

    const {id: floor} = useParams()

    const {setFloor} = useContext(GeneralContext)
    setFloor(floor ? parseInt(floor) : 1)

    const [open, setOpen] = React.useState(false);


    return (
        <>
            <CustomAppBar/>

            <Box sx={{display: 'flex', justifyContent: 'center', m: 5}}>
                <BaseFloorPlan/>
                <ActionsSpeedDial actions={actions}/>
            </Box>
        </>
    )
}
