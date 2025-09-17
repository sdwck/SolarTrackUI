import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Skeleton,
    useTheme,
} from '@mui/material';
import {
    Battery80,
    ElectricBolt,
    WbSunny,
    ThermostatAuto,
} from '@mui/icons-material';

type StatType = 'battery' | 'power' | 'solar' | 'temperature';

interface StatCardProps {
    title: string;
    value: number;
    unit: string;
    type: StatType;
    loading?: boolean;
}

const getIconAndColor = (type: StatType, theme: any) => {
    switch (type) {
        case 'battery':
            return {
                icon: <Battery80 />,
                color: theme.palette.success.main,
                bgColor: theme.palette.success.main,
                lightBg: theme.palette.success.light + '20',
            };
        case 'power':
            return {
                icon: <ElectricBolt />,
                color: theme.palette.primary.main,
                bgColor: theme.palette.primary.main,
                lightBg: theme.palette.primary.light + '20',
            };
        case 'solar':
            return {
                icon: <WbSunny />,
                color: theme.palette.warning.main,
                bgColor: theme.palette.warning.main,
                lightBg: theme.palette.warning.light + '20',
            };
        case 'temperature':
            return {
                icon: <ThermostatAuto />,
                color: theme.palette.error.main,
                bgColor: theme.palette.error.main,
                lightBg: theme.palette.error.light + '20',
            };
        default:
            return {
                icon: <ElectricBolt />,
                color: theme.palette.primary.main,
                bgColor: theme.palette.primary.main,
                lightBg: theme.palette.primary.light + '20',
            };
    }
};

export function StatCard({
    title,
    value,
    unit,
    type,
    loading = false,
}: StatCardProps) {
    const theme = useTheme();
    const { icon, color, bgColor, lightBg } = getIconAndColor(type, theme);

    const formatValue = (val: number): string => {
        if (val >= 10000) {
            return `${(val / 1000).toFixed(1)}k`;
        }
        if (val >= 1000) {
            return `${(val / 1000).toFixed(2)}k`;
        }
        return Math.round(val).toString();
    };

    const getValueColor = (): string => {
        if (type === 'battery') {
            if (value >= 80) return theme.palette.success.main;
            if (value >= 40) return theme.palette.warning.main;
            return theme.palette.error.main;
        }
        return color;
    };

    if (loading) {
        return (
            <Card
                sx={{
                    height: 130,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                }}
            >
                <CardContent sx={{ p: 2, pb: '16px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={90} height={18} sx={{  }} />
                    <Skeleton variant="text" width={50} height={40} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                height: 130,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    borderColor: color,
                    boxShadow: `0 4px 20px ${color}15`,
                    transform: 'translateY(-2px)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${bgColor}, ${bgColor}80)`,
                    borderRadius: '8px 8px 0 0',
                }
            }}
        >
            <CardContent sx={{ p: 2, pb: '16px !important', height: '100%' }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={1.5}>
                    <Avatar
                        sx={{
                            bgcolor: lightBg,
                            color: bgColor,
                            width: 40,
                            height: 40,
                            border: `2px solid ${bgColor}20`,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        mb: 1,
                        lineHeight: 1.2,
                    }}
                >
                    {title}
                </Typography>

                <Box display="flex" alignItems="baseline" justifyContent="center" gap={0.5}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            color: getValueColor(),
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {formatValue(value)}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.75rem',
                        }}
                    >
                        {unit}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}