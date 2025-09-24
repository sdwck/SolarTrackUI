import { type ModeOption } from '../types';

export const batteryModes: ModeOption[] = [
    {
        value: 'PCP00',
        label: 'Utility First',
        description: 'Prioritize utility power source'
    },
    {
        value: 'PCP01',
        label: 'Solar First',
        description: 'Prioritize solar power source'
    },
    {
        value: 'PCP02',
        label: 'SBU Priority',
        description: 'Solar-Battery-Utility priority order'
    },
    {
        value: 'PCP03',
        label: 'Only SBU',
        description: 'Solar-Battery-Utility only mode'
    }
];