import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Avatar,
    Fade,
    Skeleton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import { type SolarData } from '../../types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Battery50Icon from '@mui/icons-material/Battery50';

export interface PowerFlowCardProps {
    data: SolarData | null;
    loading?: boolean;
}

const GRID_PRESENCE_THRESHOLD = 200;

const getBatteryColor = (cap: number, theme: any) => {
    if (cap >= 80) return theme.palette.success.main;
    if (cap >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
};

export function PowerFlowCard({ data, loading = false }: PowerFlowCardProps) {
    const theme = useTheme();

    const computed = useMemo(() => {
        if (!data) return {
            acPresent: false,
            pvActive: false,
            batteryDiff: 0,
            batteryCharging: false,
            batteryDischarging: false,
            showSolarToInv: false,
            showInvToLoad: false,
            showInvToBatt: false,
            showBattToInv: false,
        };

        const acPresent = data.powerData?.acInputVoltage > GRID_PRESENCE_THRESHOLD;
        const pvActive = data.powerData?.pvInputPower > 0;
        const batteryDiff = (data.batteryData?.batteryChargingCurrent ?? 0) - (data.batteryData?.batteryDischargeCurrent ?? 0);
        const batteryCharging = batteryDiff > 0;
        const batteryDischarging = batteryDiff < 0;

        const sourceAvailable = pvActive || acPresent || batteryDischarging;

        return {
            acPresent,
            pvActive,
            batteryDiff,
            batteryCharging,
            batteryDischarging,
            showSolarToInv: pvActive,
            showInvToLoad: data.isLoadOn && sourceAvailable,
            showInvToBatt: batteryCharging,
            showBattToInv: batteryDischarging,
        };
    }, [data]);

    const pvPower = data?.powerData?.pvInputPower ?? 0;
    const acVoltage = data?.powerData?.acInputVoltage ?? 0;
    const battV = data?.batteryData?.batteryVoltage ?? 0;
    const battChargingCurrent = data?.batteryData?.batteryChargingCurrent ?? 0;

    const uid = React.useMemo(() => Math.random().toString(36).slice(2, 9), []);

    const isXsUp = useMediaQuery(theme.breakpoints.up('sm'));
    const W = isXsUp ? 560 : 360;
    const H = 220;
    const positions = {
        solar: { x: 80, y: H / 4 },
        inverter: { x: W / 2, y: H / 4 },
        load: { x: W - 80, y: H / 4 },
        battery: { x: W / 2, y: H / 4 * 3 },
    };

    if (loading || !data) {
        return (
            <Fade in timeout={600}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="h6" fontWeight={600}>
                                Power Flow
                            </Typography>
                            <Skeleton variant="circular" width={48} height={48} />
                        </Box>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Box mt={1}>
                                    <Skeleton variant="rounded" height={254} sx={{ borderRadius: 2 }} />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Fade>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight={600}>Power Flow</Typography>
                    <Avatar
                        sx={{
                            bgcolor: getBatteryColor(data.batteryData.batteryCapacity, theme),
                            width: 48,
                            height: 48,
                            boxShadow: `0 6px 18px ${getBatteryColor(data.batteryData.batteryCapacity, theme)}33`,
                        }}
                        aria-label={battChargingCurrent && battChargingCurrent > 0 ? 'charging' : 'battery'}
                    >
                        {battChargingCurrent && battChargingCurrent > 0 ? <BatteryChargingFullIcon /> : <BatteryFullIcon />}
                    </Avatar>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ position: 'relative', borderRadius: 1, bgcolor: 'background.paper', p: 2, border: '1px solid', borderColor: 'divider' }}>
                            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
                                <style>{`.flow-${uid} { stroke-dasharray: 10 6; animation: dash-${uid} 0.9s linear infinite; } @keyframes dash-${uid} { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -16; } }`}</style>
                                <defs>
                                    <marker id={`m-solar-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.palette.warning.main} />
                                    </marker>
                                    <marker id={`m-inv-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.palette.primary.main} />
                                    </marker>
                                    <marker id={`m-grid-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.palette.info.main} />
                                    </marker>
                                    <marker id={`m-batt-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.palette.success.main} />
                                    </marker>
                                </defs>

                                {computed.showSolarToInv && (
                                    <>
                                        <g transform={`translate(${positions.solar.x - 18}, ${positions.solar.y - 18})`}>
                                            <circle cx={18} cy={18} r={18} fill="#FEF3C7" stroke="#F59E0B" strokeWidth={1} />
                                        </g>
                                        <text x={positions.solar.x} y={positions.solar.y + 36} textAnchor="middle" fontSize={11} fill={theme.palette.text.primary}>Solar</text>
                                    </>
                                )}

                                <g transform={`translate(${positions.inverter.x - 26}, ${positions.inverter.y - 22})`}>
                                    <rect x={0} y={0} width={52} height={44} rx={8} fill="#F8FAFC" stroke="#CBD5E1" />
                                </g>

                                <g transform={`translate(${positions.load.x - 18}, ${positions.load.y - 18})`}>
                                    <circle cx={18} cy={18} r={18} fill="#EFF6FF" stroke="#93C5FD" strokeWidth={1} />
                                </g>
                                <text x={positions.load.x} y={positions.load.y + 36} textAnchor="middle" fontSize={11} fill={theme.palette.text.primary}>Load</text>

                                {(computed.showInvToBatt || computed.showBattToInv) && (
                                    <>
                                        <g transform={`translate(${positions.battery.x - 18}, ${positions.battery.y - 18})`}>
                                            <circle cx={18} cy={18} r={18} fill="#ECFDF5" stroke="#34D399" strokeWidth={1} />
                                        </g>
                                        <text x={positions.battery.x} y={positions.battery.y + 36} textAnchor="middle" fontSize={11} fill={theme.palette.text.primary}>Battery</text>
                                    </>
                                )}

                                {computed.showSolarToInv && (
                                    <line x1={positions.solar.x + 18} y1={positions.solar.y} x2={positions.inverter.x - 26} y2={positions.inverter.y} stroke={theme.palette.warning.main} strokeWidth={3} strokeLinecap="round" markerEnd={`url(#m-solar-${uid})`} className={`flow-${uid}`} />
                                )}
                                {computed.showInvToLoad && (
                                    <line x1={positions.inverter.x + 26} y1={positions.inverter.y} x2={positions.load.x - 18} y2={positions.load.y} stroke={theme.palette.primary.main} strokeWidth={3} strokeLinecap="round" markerEnd={`url(#m-inv-${uid})`} className={`flow-${uid}`} />
                                )}
                                {computed.showBattToInv && (
                                    <line x1={positions.battery.x} y1={positions.battery.y - 18} x2={positions.inverter.x} y2={positions.inverter.y + 22} stroke={theme.palette.success.main} strokeWidth={2.5} strokeLinecap="round" markerEnd={`url(#m-batt-${uid})`} className={`flow-${uid}`} />
                                )}
                                {computed.showInvToBatt && (
                                    <line x1={positions.inverter.x} y1={positions.inverter.y + 22} x2={positions.battery.x} y2={positions.battery.y - 18} stroke={theme.palette.success.main} strokeWidth={2.5} strokeLinecap="round" markerEnd={`url(#m-batt-${uid})`} className={`flow-${uid}`} />
                                )}

                                <text
                                    x={positions.inverter.x}
                                    y={positions.inverter.y - 32}
                                    textAnchor="middle"
                                    fontSize={11}
                                    fill={theme.palette.text.primary}
                                >
                                    Inverter
                                </text>
                            </svg>

                            <Box sx={{ position: 'absolute', left: 16, top: 16, fontSize: 12, color: 'text.secondary' }}>
                                <div>PV: <strong>{pvPower.toFixed(0)} W</strong></div>
                                <div>AC: <strong>{acVoltage} V</strong></div>
                            </Box>

                            <Box sx={{ position: 'absolute', right: 16, top: 16, fontSize: 12, color: 'text.secondary', textAlign: 'right' }}>
                                <div>Bat: <strong>{battV.toFixed(2)} V</strong></div>
                                <div>Chg: <strong>{computed.batteryDiff > 0 ? '+' : ''}{computed.batteryDiff.toFixed(1)} A</strong></div>
                            </Box>

                            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 8, fontSize: 12, color: 'text.secondary' }}>
                                {computed.batteryCharging ? (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <BatteryChargingFullIcon sx={{ color: 'success.main' }} fontSize="small" />
                                        <Typography variant="caption">Battery charging</Typography>
                                    </Box>
                                ) : computed.batteryDischarging ? (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Battery50Icon sx={{ color: 'success.main' }} fontSize="small" />
                                        <Typography variant="caption" sx={{ color: 'error.main' }}>Battery discharging</Typography>
                                    </Box>
                                ) : (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <BatteryFullIcon sx={{ color: 'text.secondary' }} fontSize="small" />
                                        <Typography variant="caption" color="text.secondary">Battery idle</Typography>
                                    </Box>
                                )}
                            </Box>

                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
