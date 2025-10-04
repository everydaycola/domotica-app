import {Box} from "@mui/material";

export function BaseFloorPlan() {
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            minHeight: '100vh',
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