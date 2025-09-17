export interface CreateMaintenanceTaskRequest {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    category: 'cleaning' | 'inspection' | 'repair' | 'upgrade' | 'calibration' | 'other';
    estimatedDuration?: number;
    assignedTo?: string;
    notes?: string;
    tags?: string[];
}