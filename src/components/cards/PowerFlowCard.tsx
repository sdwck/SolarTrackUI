import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Skeleton,
    useTheme
} from '@mui/material';
import {
    BatteryFull,
    Home,
    SolarPower,
    ElectricBolt
} from '@mui/icons-material';
import { type SolarData } from '../../types';

export interface PowerFlowCardProps {
    solarData?: SolarData | null;
    loading?: boolean;
}

type FlowDirection = 'charging' | 'discharging' | 'neutral';

export function PowerFlowCard({ solarData, loading = false }: PowerFlowCardProps) {
    const theme = useTheme();

    const getFlowDirection = (): FlowDirection => {
        if (!solarData?.batteryData) return 'neutral';

        const { batteryChargingCurrent, batteryDischargeCurrent } = solarData.batteryData;

        if (batteryChargingCurrent > 0) return 'charging';
        if (batteryDischargeCurrent > 0) return 'discharging';
        return 'neutral';
    };

    const flowDirection = getFlowDirection();
    const isPvActive = (solarData?.powerData?.pvInputPower ?? 0) > 0;
    const isLoadActive = solarData?.isLoadOn ?? false;
    const isAcCharging = solarData?.isAcChargingOn ?? false;

    if (loading) {
        return (
            <Card className="h-96">
                <CardContent className="p-6">
                    <Skeleton variant="text" width={200} height={32} className="mb-6" />
                    <div className="flex justify-center items-center h-80">
                        <Skeleton variant="rounded" width="100%" height="100%" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const AnimatedArrow = ({ direction, color, active }: { direction: string, color: string, active: boolean }) => {
        if (!active) return null;

        const arrowClasses = `absolute w-4 h-4 ${active ? 'animate-pulse' : 'opacity-30'}`;
        const borderColor = color;

        switch (direction) {
            case 'down':
                return (
                    <div className={`${arrowClasses} border-l-2 border-r-2 border-t-4`}
                        style={{
                            borderTopColor: borderColor,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent'
                        }}
                    />
                );
            case 'up':
                return (
                    <div className={`${arrowClasses} border-l-2 border-r-2 border-b-4`}
                        style={{
                            borderBottomColor: borderColor,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent'
                        }}
                    />
                );
            case 'right':
                return (
                    <div className={`${arrowClasses} border-t-2 border-b-2 border-l-4`}
                        style={{
                            borderLeftColor: borderColor,
                            borderTopColor: 'transparent',
                            borderBottomColor: 'transparent'
                        }}
                    />
                );
            case 'left':
                return (
                    <div className={`${arrowClasses} border-t-2 border-b-2 border-r-4`}
                        style={{
                            borderRightColor: borderColor,
                            borderTopColor: 'transparent',
                            borderBottomColor: 'transparent'
                        }}
                    />
                );
            default:
                return null;
        }
    };

    const FlowLine = ({ direction, color, active }: { direction: string, color: string, active: boolean }) => {
        if (!active) return null;

        const lineClasses = `absolute bg-gradient-to-r ${active ? 'animate-pulse' : 'opacity-30'}`;

        switch (direction) {
            case 'vertical':
                return <div className={`${lineClasses} w-1 h-16`} style={{ backgroundColor: color }} />;
            case 'horizontal':
                return <div className={`${lineClasses} h-1 w-16`} style={{ backgroundColor: color }} />;
            default:
                return null;
        }
    };

    return (
        <Card className="h-96">
            <CardContent className="p-6">
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Energy Flow - Classic Inverter View
                </Typography>

                <div className="relative h-80 flex flex-col justify-between items-center">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-300 ${isPvActive
                                        ? 'bg-orange-100 border-orange-400 shadow-orange-200'
                                        : 'bg-gray-100 border-gray-300'
                                    }`}
                            >
                                <SolarPower
                                    className={`text-3xl ${isPvActive ? 'text-orange-600' : 'text-gray-400'}`}
                                />
                            </div>
                            <div className="mt-2 text-center">
                                <Typography variant="body2" fontWeight={600}>
                                    Solar
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontWeight={700}
                                    className={isPvActive ? 'text-orange-600' : 'text-gray-400'}
                                >
                                    {solarData?.powerData?.pvInputPower ?? 0}W
                                </Typography>
                            </div>

                            {isPvActive && (
                                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                    <FlowLine direction="vertical" color={theme.palette.warning.main} active={isPvActive} />
                                    <AnimatedArrow direction="down" color={theme.palette.warning.main} active={isPvActive} />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center relative">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 bg-blue-100 border-blue-400 shadow-blue-200"
                            >
                                <ElectricBolt className="text-3xl text-blue-600" />
                            </div>
                            <div className="mt-2 text-center">
                                <Typography variant="body2" fontWeight={600}>
                                    AC Input
                                </Typography>
                                <Typography variant="body1" fontWeight={700} className="text-blue-600">
                                    {solarData?.powerData?.acInputVoltage ?? 0}V
                                </Typography>
                            </div>

                            {isAcCharging && (
                                <div className="absolute top-24 right-1/2 transform translate-x-1/2 flex flex-col items-center">
                                    <FlowLine direction="vertical" color={theme.palette.info.main} active={isAcCharging} />
                                    <AnimatedArrow direction="down" color={theme.palette.info.main} active={isAcCharging} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center relative">
                        <div
                            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 transition-all duration-300 ${flowDirection === 'charging'
                                    ? 'bg-green-100 border-green-500 shadow-green-200'
                                    : flowDirection === 'discharging'
                                        ? 'bg-red-100 border-red-500 shadow-red-200'
                                        : 'bg-gray-100 border-gray-400'
                                }`}
                        >
                            <BatteryFull
                                className={`text-4xl ${flowDirection === 'charging' ? 'text-green-600' :
                                        flowDirection === 'discharging' ? 'text-red-600' :
                                            'text-gray-400'
                                    }`}
                            />
                        </div>
                        <div className="mt-2 text-center">
                            <Typography variant="body2" fontWeight={600}>
                                Battery
                            </Typography>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                className={
                                    flowDirection === 'charging' ? 'text-green-600' :
                                        flowDirection === 'discharging' ? 'text-red-600' :
                                            'text-gray-400'
                                }
                            >
                                {solarData?.batteryData?.batteryCapacity ?? 0}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {solarData?.batteryData?.batteryVoltage ?? 0}V
                            </Typography>
                        </div>

                        {flowDirection === 'charging' && (
                            <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-1 animate-bounce">
                                <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                        )}
                        {flowDirection === 'discharging' && (
                            <div className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1 animate-bounce">
                                <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center relative">
                        <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-300 ${isLoadActive
                                    ? 'bg-purple-100 border-purple-400 shadow-purple-200'
                                    : 'bg-gray-100 border-gray-300'
                                }`}
                        >
                            <Home
                                className={`text-3xl ${isLoadActive ? 'text-purple-600' : 'text-gray-400'}`}
                            />
                        </div>
                        <div className="mt-2 text-center">
                            <Typography variant="body2" fontWeight={600}>
                                Load
                            </Typography>
                            <Typography
                                variant="body1"
                                fontWeight={700}
                                className={isLoadActive ? 'text-purple-600' : 'text-gray-400'}
                            >
                                {solarData?.powerData?.acOutputActivePower ?? 0}W
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {solarData?.powerData?.acOutputLoad ?? 0}%
                            </Typography>
                        </div>

                        {flowDirection === 'discharging' && isLoadActive && (
                            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                <AnimatedArrow direction="down" color={theme.palette.error.main} active={true} />
                                <FlowLine direction="vertical" color={theme.palette.error.main} active={true} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex justify-center gap-2 flex-wrap">
                    <Chip
                        size="small"
                        label={
                            flowDirection === 'charging' ? 'Charging Battery' :
                                flowDirection === 'discharging' ? 'Battery → Load' :
                                    'System Idle'
                        }
                        color={
                            flowDirection === 'charging' ? 'success' :
                                flowDirection === 'discharging' ? 'error' :
                                    'default'
                        }
                        className="font-semibold"
                    />
                    {isPvActive && (
                        <Chip
                            size="small"
                            label="Solar Active"
                            className="bg-orange-100 text-orange-800 font-semibold"
                        />
                    )}
                    {isLoadActive && (
                        <Chip
                            size="small"
                            label="Load Active"
                            className="bg-purple-100 text-purple-800 font-semibold"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}