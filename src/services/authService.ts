import { type AxiosResponse } from 'axios';
import axios from '../utils/axiosConfig';
import { type AuthResponse, type LoginRequest, type User } from "../types"

class AuthService {
    private tokenRefreshPromise: Promise<string> | null = null;

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await axios.post(
            `/auth/login`,
            credentials
        );

        if (response.data.accessToken) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }

        return response.data;
    }

    async logout(): Promise<void> {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            try {
                await axios.post(`/auth/logout`, { refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        this.clearTokens();
    }

    async getCurrentUser(): Promise<User> {
        const response: AxiosResponse<User> = await axios.get(
            `/auth/me`
        );
        return response.data;
    }

    async refreshToken(): Promise<string> {
        if (this.tokenRefreshPromise) {
            return this.tokenRefreshPromise;
        }

        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        this.tokenRefreshPromise = this.performTokenRefresh(refreshToken);

        try {
            const newToken = await this.tokenRefreshPromise;
            return newToken;
        } finally {
            this.tokenRefreshPromise = null;
        }
    }

    private async performTokenRefresh(refreshToken: string): Promise<string> {
        try {
            const response: AxiosResponse<{ accessToken: string; refreshToken: string; expiresAt: string }> =
                await axios.post(`/auth/refresh`, { refreshToken });

            this.setTokens(response.data.accessToken, response.data.refreshToken);
            return response.data.accessToken;
        } catch (error) {
            this.clearTokens();
            throw error;
        }
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    private setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    private clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        } catch {
            return true;
        }
    }

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        return token !== null && !this.isTokenExpired(token);
    }
}

export default new AuthService();