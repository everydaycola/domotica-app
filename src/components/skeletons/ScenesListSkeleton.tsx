import {Box, Divider, Skeleton, Stack, Typography} from "@mui/material";

export function ScenesListSkeleton() {
  return (
    <Box sx={{ flex: 2, minWidth: 320 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Scenes</Typography>
      <Divider />
      <Stack sx={{ mt: 2 }} spacing={1}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={64} />
        ))}
      </Stack>
    </Box>
  );
}