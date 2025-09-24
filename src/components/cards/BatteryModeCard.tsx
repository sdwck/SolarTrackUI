import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    Skeleton
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { batteryModes } from '../../constants/batteryModes';

export interface BatteryModeCardProps {
    currentMode: string;
    onModeChange: (mode: string) => Promise<void>;
    loading?: boolean;
}

export function BatteryModeCard({
    currentMode,
    onModeChange,
    loading = false
}: BatteryModeCardProps) {
    const [selectedMode, setSelectedMode] = useState<string>(currentMode);
    const [applying, setApplying] = useState<boolean>(false);

    useEffect(() => {
        setSelectedMode(currentMode);
    }, [currentMode]);

    const handleApply = async (): Promise<void> => {
        if (selectedMode === currentMode) return;

        setApplying(true);
        try {
            await onModeChange(selectedMode);
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                    <Box display="flex" flexDirection="column" gap={1}>
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} variant="rounded" height={48} />
                        ))}
                    </Box>
                    <Skeleton variant="rounded" width={100} height={36} sx={{ mt: 2 }} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent sx={{ p: 3, height: { md: '91%' } }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Battery Mode
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "space-between", height: '100%' }}>
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            value={selectedMode}
                            onChange={(e) => setSelectedMode(e.target.value)}
                        >
                            {batteryModes.map((mode) => (
                                <FormControlLabel
                                    key={mode.value}
                                    value={mode.value}
                                    control={<Radio />}
                                    label={
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {mode.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {mode.description}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        m: 0.5,
                                        p: 1,
                                        border: selectedMode === mode.value ? '2px solid' : '1px solid',
                                        borderColor: selectedMode === mode.value ? 'primary.main' : 'divider',
                                        borderRadius: 1,
                                        bgcolor: selectedMode === mode.value ? 'primary.50' : 'transparent'
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <Box mt={2}>
                        <Button
                            variant="contained"
                            onClick={handleApply}
                            disabled={selectedMode === currentMode || applying}
                            startIcon={<Settings />}
                            sx={{ borderRadius: 2 }}
                        >
                            {applying ? 'Applying...' : 'Apply'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}