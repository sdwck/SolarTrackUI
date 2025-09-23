export interface MaintenanceTask {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate: string;
    createdAt: string;
    completedAt?: string;
    category: 'cleaning' | 'inspection' | 'repair' | 'upgrade' | 'calibration' | 'other';
    estimatedDuration?: number;
    assignedTo?: string;
    notes?: string;
    tags?: string[];
}