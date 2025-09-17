import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Home, ArrowBack, WbSunny } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={{
            bgcolor: 'background.default',
            minHeight: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        bgcolor: 'background.paper'
                    }}>
                    <WbSunny sx={{
                        fontSize: 80,
                        color: 'warning.main',
                        mb: 3,
                        opacity: 0.7
                    }} />
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '6rem', md: '8rem' },
                            fontWeight: 700,
                            color: 'primary.main',
                            mb: 2,
                            lineHeight: 1
                        }}>404</Typography>
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight={600}
                        color="text.primary"
                        gutterBottom
                        sx={{ mb: 2 }}>
                        Page Not Found
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                        The solar panel monitoring page you're looking for seems to have gone off-grid.
                        Let's get you back to tracking your energy production.
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                        <Button
                            variant="contained"
                            startIcon={<Home />}
                            onClick={handleGoHome}
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600
                            }}>
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleGoBack}
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600
                            }}>
                            Go Back
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box >
    );
}