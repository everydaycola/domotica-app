import {useParams} from "react-router-dom";
import CustomAppBar from "../components/appBar/AppBar.tsx";
import {GeneralContext} from "../context/GeneralContext.ts";
import {useContext} from "react";
import {BaseFloorPlan} from "../components/floorPlan/BaseFloorPlan.tsx";
import {Box} from "@mui/material";

export function Verdieping() {

    const {id: floor} = useParams()

    const {setFloor} = useContext(GeneralContext)
    setFloor(floor ? parseInt(floor) : 1)

    return (
        <>
            <CustomAppBar/>

            <Box sx={{display: 'flex', justifyContent: 'center', m: 5}}>
                <BaseFloorPlan/>
            </Box>
        </>
    )
}
