import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    Avatar,
    Container,
    InputAdornment,
    IconButton,
    Stack
} from '@mui/material';
import {
    WbSunny as SolarIcon,
    Visibility,
    VisibilityOff,
    Person as PersonIcon,
    Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(credential, password);

        if (!result.success) {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                backgroundImage: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Card
                    sx={{
                        boxShadow: 4,
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: 64,
                                    height: 64,
                                    mb: 2,
                                }}
                            >
                                <SolarIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                SolarTrack
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                Sign in to access your solar energy management system
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
                                Access restricted to authorized personnel only
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    id="credential"
                                    label="Username/Email"
                                    variant="outlined"
                                    value={credential}
                                    onChange={(e) => setCredential(e.target.value)}
                                    required
                                    disabled={loading}
                                    placeholder='Enter your username or email'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    placeholder='Enter your password'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Stack>
                        </Box>

                        <Box mt={3} textAlign="center">
                            <Typography variant="caption" color="text.disabled">
                                Having trouble? Contact your system administrator
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};
