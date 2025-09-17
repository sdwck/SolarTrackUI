import React, { Component, type ReactNode } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Alert,
    AlertTitle,
} from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReload = (): void => {
        window.location.reload();
    };

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        bgcolor: 'background.default',
                    }}
                >
                    <Card sx={{ maxWidth: 600, width: '100%' }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <ErrorOutline
                                sx={{
                                    fontSize: 80,
                                    color: 'error.main',
                                    mb: 3,
                                }}
                            />

                            <Typography variant="h4" gutterBottom fontWeight="bold">
                                Something went wrong
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                We apologize for the inconvenience. An unexpected error has occurred
                                in the application.
                            </Typography>

                            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                                <AlertTitle>Error Details</AlertTitle>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {this.state.error?.message || 'Unknown error'}
                                </Typography>
                            </Alert>

                            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                                <Button
                                    variant="contained"
                                    startIcon={<Refresh />}
                                    onClick={this.handleReload}
                                >
                                    Reload Page
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={this.handleReset}
                                >
                                    Try Again
                                </Button>
                            </Box>

                            {this.state.errorInfo && (
                                <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
                                    <AlertTitle>Development Info</AlertTitle>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        {this.state.errorInfo.componentStack}
                                    </Typography>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };