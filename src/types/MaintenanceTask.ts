export interface MaintenanceTask {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate: string; // ISO string
    createdAt: string; // ISO string
    completedAt?: string; // ISO string
    category: 'cleaning' | 'inspection' | 'repair' | 'upgrade' | 'calibration' | 'other';
    estimatedDuration?: number; // minutes
    assignedTo?: string;
    notes?: string;
    tags?: string[];
}