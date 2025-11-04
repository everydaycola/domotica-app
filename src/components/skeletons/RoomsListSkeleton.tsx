import {Box, Skeleton, Stack} from "@mui/material";

export function RoomsListSkeleton() {
  return (
    <Box sx={{ flex: 1, minWidth: 280 }}>
      <Stack sx={{ mt: 1 }} spacing={1}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={48} />
        ))}
      </Stack>
    </Box>
  );
}