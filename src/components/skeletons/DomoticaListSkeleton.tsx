import {Box, Divider, Skeleton, Stack, TextField, Select, MenuItem, Button} from "@mui/material";

export function DomoticaListSkeleton() {
  return (
    <Box sx={{ width: '100%', maxWidth: 900 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1 }}>
        <TextField size="small" placeholder="Search" disabled fullWidth />
        <Select size="small" value="all" disabled sx={{ minWidth: 160 }}>
          <MenuItem value="all">All types</MenuItem>
        </Select>
        <Button size="small" disabled>Reset</Button>
        <Button size="small" variant="contained" disabled>Add domotica</Button>
      </Stack>
      <Divider />
      <Stack sx={{ mt: 2 }} spacing={1}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={64} />
        ))}
      </Stack>
    </Box>
  );
}