import {Box} from "@mui/material";

export interface BaseFloorPlanProps {
    widthMm: number;
    heightMm: number;
}

export function BaseFloorPlan({ widthMm, heightMm }: BaseFloorPlanProps) {
    const aspect = widthMm > 0 && heightMm > 0 ? widthMm / heightMm : 1;

    return (
        <Box sx={{
            width: '70vw',
            maxHeight: '70vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            p: 1,
            m: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            bgcolor: 'background.default',
            position: 'relative',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
        }}>
            <Box sx={{
                width: '100%',
                aspectRatio: aspect,
                bgcolor: 'background.paper',
                border: '2px dotted black',
                position: 'relative',
            }}>
                {/* Width label (top center) */}
                <Box sx={{
                    position: 'absolute',
                    top: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    px: 1,
                    py: 0.25,
                    bgcolor: 'rgba(255,255,255,0.85)',
                    borderRadius: 0.5,
                    fontSize: 12,
                    fontWeight: 500,
                    boxShadow: 1,
                }}>
                    {`${widthMm} mm`}
                </Box>

                {/* Height label (left center, rotated) */}
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 4,
                    transform: 'translateY(-50%) rotate(-90deg)',
                    transformOrigin: 'left center',
                    px: 1,
                    py: 0.25,
                    bgcolor: 'rgba(255,255,255,0.85)',
                    borderRadius: 0.5,
                    fontSize: 12,
                    fontWeight: 500,
                    boxShadow: 1,
                }}>
                    {`${heightMm} mm`}
                </Box>
            </Box>
        </Box>
    )
}