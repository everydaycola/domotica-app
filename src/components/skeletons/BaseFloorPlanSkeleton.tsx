import {Box, Skeleton} from "@mui/material";

export function BaseFloorPlanSkeleton() {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="rounded" sx={{ width: '100%', aspectRatio: '16 / 9', minHeight: { xs: 220, sm: 280, md: 340 } }} />
    </Box>
  );
}