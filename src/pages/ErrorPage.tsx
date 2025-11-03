import {Box, Button, Container, Paper, Stack, Typography} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import ReportProblemIcon from '@mui/icons-material/ReportProblemOutlined';
import {useNavigate} from "react-router-dom";

export type ErrorPageProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorPage({ title = "Something went wrong", message = "We couldn't load the rooms for this floor. Please try again.", onRetry }: ErrorPageProps) {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ReportProblemIcon color="error" sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h5" component="h1" gutterBottom>{title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{message}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          {onRetry && (
            <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={onRetry}>
              Retry
            </Button>
          )}
          <Button variant="outlined" color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/')}>Go to home</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ErrorPage;
