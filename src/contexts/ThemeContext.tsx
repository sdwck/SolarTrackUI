import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ThemeProvider, createTheme, type Theme } from '@mui/material/styles';
import { type PaletteMode } from '@mui/material';

interface ThemeContextType {
    mode: PaletteMode;
    toggleTheme: () => void;
    theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within ThemeContextProvider');
    }
    return context;
};

const getTheme = (mode: PaletteMode): Theme =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: mode === 'dark' ? '#90caf9' : '#2196f3',
                light: mode === 'dark' ? '#e3f2fd' : '#64b5f6',
                dark: mode === 'dark' ? '#42a5f5' : '#1976d2',
            },
            secondary: {
                main: mode === 'dark' ? '#ffcc02' : '#ff9800',
                light: mode === 'dark' ? '#fff350' : '#ffb74d',
                dark: mode === 'dark' ? '#c79100' : '#f57c00',
            },
            background: {
                default: mode === 'dark' ? '#121212' : '#f5f5f5',
                paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            },
            success: {
                main: mode === 'dark' ? '#66bb6a' : '#4caf50',
            },
            warning: {
                main: mode === 'dark' ? '#ffb74d' : '#ff9800',
            },
            error: {
                main: mode === 'dark' ? '#ef5350' : '#f44336',
            },
            text: {
                primary: mode === 'dark' ? '#ffffff' : '#000000',
                secondary: mode === 'dark' ? '#b3b3b3' : '#666666',
            },
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
                fontSize: '2.5rem',
            },
            h2: {
                fontWeight: 600,
                fontSize: '2rem',
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.75rem',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.5rem',
            },
            h5: {
                fontWeight: 600,
                fontSize: '1.25rem',
            },
            h6: {
                fontWeight: 500,
                fontSize: '1.125rem',
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.5,
            },
            body2: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: mode === 'dark'
                            ? '0 4px 20px rgba(0,0,0,0.3)'
                            : '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            // transform: 'translateY(-2px)',
                            boxShadow: mode === 'dark'
                                ? '0 8px 30px rgba(0,0,0,0.4)'
                                : '0 8px 30px rgba(0,0,0,0.15)',
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        fontWeight: 500,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
        },
    });

interface ThemeContextProviderProps {
    children: ReactNode;
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [mode, setMode] = useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem('themeMode') as PaletteMode;
        return savedMode || 'light';
    });

    const theme = getTheme(mode);

    const toggleTheme = (): void => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent): void => {
            if (!localStorage.getItem('themeMode')) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const contextValue: ThemeContextType = {
        mode,
        toggleTheme,
        theme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};