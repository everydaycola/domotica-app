import {Box, Divider, Skeleton, Stack, Typography} from "@mui/material";

export function RoomsListSkeleton() {
  return (
    <Box sx={{ flex: 1, minWidth: 280 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">Rooms</Typography>
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