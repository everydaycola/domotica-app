
import {Box, Skeleton, Grid} from "@mui/material";

export function ScenesListSkeleton() {
  return (
    <Box sx={{minWidth: 320}}>
      <Grid container spacing={2}>
        {(new Array(6)).fill(0).map((_, index) => (
          <Grid key={index} size={{xs: 12, sm: 6, md: 4}}>
            <Skeleton variant="rectangular" height={200}/>
            <Box sx={{pt: 1}}>
              <Skeleton width="60%"/>
              <Skeleton width="40%"/>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}