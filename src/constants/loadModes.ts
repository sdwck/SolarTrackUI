import { type ModeOption } from '../types';

export const loadModes: ModeOption[] = [
    {
        value: 'POP00',
        label: 'Utility First',
        description: 'Prioritize utility power for load'
    },
    {
        value: 'POP01',
        label: 'Solar First',
        description: 'Prioritize solar power for load'
    },
    {
        value: 'POP02',
        label: 'SBU Priority',
        description: 'Solar-Battery-Utility priority for load'
    }
];