import {Box} from "@mui/material";

export interface BaseFloorPlanProps {
    ratio: number;
}


export function BaseFloorPlan({ratio}: BaseFloorPlanProps) {
    return (
        <Box sx={{
            width: '70vw',
            aspectRatio: ratio,
            bgcolor: 'background.paper',
            display: 'flex',
            gap: 2,
            m: 1,
            borderShadow: 2,
            border: '2px dotted black',
        }}>
        </Box>
    )
}