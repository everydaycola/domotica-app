import {Box, Button, Container, Paper, Typography} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import ReportProblemIcon from '@mui/icons-material/ReportProblemOutlined';

export type ErrorPageProps = {
  title: string;
  message: string;
  onRetry: () => void;
};

export function ErrorPage({title, message, onRetry}: Readonly<ErrorPageProps>) {
  return (
    <Container maxWidth="md" sx={{py: 6}}>
      <Paper elevation={2} sx={{p: {xs: 3, sm: 4}, textAlign: 'center'}}>
        <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
          <ReportProblemIcon color="error" sx={{fontSize: 48}}/>
        </Box>
        <Typography variant="h5" component="h1" gutterBottom>{title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>{message}</Typography>
        <Button variant="contained" color="primary" startIcon={<RefreshIcon/>} onClick={onRetry}>
          Retry
        </Button>
      </Paper>
    </Container>
  );
}