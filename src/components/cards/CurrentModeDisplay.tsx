import {
    Card,
    CardContent,
    Typography,
    Chip,
    Skeleton
} from '@mui/material';
import {
    Settings,
    Battery90,
    PowerSettingsNew
} from '@mui/icons-material';
import { batteryModes } from '../../constants/batteryModes';
import { loadModes } from '../../constants/loadModes';
import { useTheme } from '@mui/material/styles';

interface CurrentModeDisplayProps {
    batteryMode: string;
    loadMode: string;
    loading?: boolean;
}

export function CurrentModeDisplay({ batteryMode, loadMode, loading = false }: CurrentModeDisplayProps) {
    const getBatteryModeInfo = (mode: string) => {
        return batteryModes.find(m => m.value === mode) || { label: mode, description: 'Unknown mode' };
    };

    const getLoadModeInfo = (mode: string) => {
        return loadModes.find(m => m.value === mode) || { label: mode, description: 'Unknown mode' };
    };

    if (loading) {
        return (
            <Card sx={{ width: '100%' }}>
                <CardContent className="p-6">
                    <Skeleton variant="text" width={180} height={32} />
                    <div className="space-y-4 mt-4">
                        <div>
                            <Skeleton variant="rounded" width={'100%'} height={125} />
                        </div>
                        <div>
                            <Skeleton variant="rounded" width={'100%'} height={125} />
                        </div>
                        <div>
                            <Skeleton variant="rounded" width={'100%'} height={44} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const batteryModeInfo = getBatteryModeInfo(batteryMode);
    const loadModeInfo = getLoadModeInfo(loadMode);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="text-xl text-gray-600" />
                    <Typography variant="h6" fontWeight={600}>
                        Current Operating Modes
                    </Typography>
                </div>

                <div className="space-y-4">
                    <div
                        className={`p-4 rounded-lg border ${isDarkMode
                                ? 'bg-green-900 border-green-700'
                                : 'bg-green-50 border-green-200'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Battery90
                                className={`text-lg ${isDarkMode ? 'text-green-300' : 'text-green-600'
                                    }`}
                            />
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                className={isDarkMode ? 'text-green-200' : 'text-green-800'}
                            >
                                Battery Mode
                            </Typography>
                        </div>
                        <Chip
                            label={`${batteryMode} - ${batteryModeInfo.label}`}
                            color="success"
                            variant="filled"
                            size="medium"
                            className="font-semibold mb-2"
                        />
                        <Typography variant="caption" color="text.secondary" display="block">
                            {batteryModeInfo.description}
                        </Typography>
                    </div>

                    <div
                        className={`p-4 rounded-lg border ${isDarkMode
                                ? 'bg-blue-900 border-blue-700'
                                : 'bg-blue-50 border-blue-200'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <PowerSettingsNew
                                className={`text-lg ${isDarkMode ? 'text-blue-300' : 'text-blue-600'
                                    }`}
                            />
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}
                            >
                                Load Mode
                            </Typography>
                        </div>
                        <Chip
                            label={`${loadMode} - ${loadModeInfo.label}`}
                            color="primary"
                            variant="filled"
                            size="medium"
                            className="font-semibold mb-2"
                        />
                        <Typography variant="caption" color="text.secondary" display="block">
                            {loadModeInfo.description}
                        </Typography>
                    </div>
                </div>

                <div
                    className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        className="flex items-center gap-1"
                    >
                        <div
                            className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-green-400' : 'bg-green-500'
                                }`}
                        ></div>
                        Modes are actively controlling system behavior
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}