import { type ApiError } from './ApiError';

export interface ApiResponse<T> {
    data: T | null;
    error: ApiError | null;
    loading: boolean;
}