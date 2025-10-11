import {Box} from "@mui/material";

export function BaseFloorPlan() {
    const ratio = 1.5
    
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