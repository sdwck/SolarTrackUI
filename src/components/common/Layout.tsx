import { useState, type ReactElement } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
    Avatar,
    Switch,
    Divider,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    ViewList as ListIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
    LightMode,
    DarkMode,
    Notifications as NotificationsIcon,
    WbSunny as SolarIcon,
    Build as BuildIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../contexts/ThemeContext';
import { BatteryFull as BatteryFullIcon } from '@mui/icons-material';

const drawerWidth = 280;

interface NavigationItem {
    text: string;
    path: string;
    icon: ReactElement;
    badge?: number;
}

const navigationItems: NavigationItem[] = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
    { text: 'Diagnostics', path: '/diagnostics', icon: <SolarIcon /> },
    { text: 'Maintenance', path: '/maintenance', icon: <BuildIcon /> },
    { text: 'Battery', path: '/battery', icon: <BatteryFullIcon /> },
    { text: 'History', path: '/history', icon: <ListIcon /> },
    { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export function Layout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const { mode, toggleTheme } = useThemeMode();
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = (): void => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path: string): void => {
        window.scrollTo({ top: 0 });
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ px: 3, py: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                        mr: 2,
                    }}
                >
                    <SolarIcon />
                </Avatar>
                <Typography variant="h6" noWrap component="div" fontWeight="bold">
                    SolarTrack
                </Typography>
            </Toolbar>

            <Divider />

            <List sx={{ px: 2, py: 1 }}>
                {navigationItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.25,
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'primary.contrastText' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.badge ? (
                                        <Badge badgeContent={item.badge} color="error">
                                            {item.icon}
                                        </Badge>
                                    ) : (
                                        item.icon
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <LightMode sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Switch
                            checked={mode === 'dark'}
                            onChange={toggleTheme}
                            size="small"
                        />
                        <DarkMode sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {mode === 'dark' ? 'Dark' : 'Light'} Mode
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: theme.shadows[1],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton color="inherit">
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="navigation"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: `1px solid ${theme.palette.divider}`,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};
