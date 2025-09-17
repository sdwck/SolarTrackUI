import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoadingSpinnerProps {
    message?: string;
}

export function LoadingSpinner({ message = 'Loading…' }: LoadingSpinnerProps) {
    return (
        <Fade in timeout={200}>
            <Box
                sx={{
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                }}
            >
                <Box textAlign="center">
                    <CircularProgress size={48} thickness={4} />
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 2, fontWeight: 500 }}
                    >
                        {message}
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
};
