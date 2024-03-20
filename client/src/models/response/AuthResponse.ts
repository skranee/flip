import {IUser} from "../IUser";

export interface getUserResponse {
    requestedUsername: string;
    hasVerifiedBadge: boolean;
    id: number;
    name: string;
    displayName: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}