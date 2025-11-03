import {Box, Divider, Skeleton, Stack, Typography} from "@mui/material";

export function FloorsListSkeleton() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">Floors</Typography>
      </Stack>
      <Divider />
      <Stack sx={{ mt: 1 }} spacing={1}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={48} />
        ))}
      </Stack>
    </Box>
  );
}