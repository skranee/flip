import {IItem} from "./IItem";

export interface IUser {
    username: string;
    avatar: string;
    robloxId: string;
    regDate: string;
    id: string;
    totalWagered: number;
    totalWithdrawn: number;
    totalDeposited: number;
    gamesPlayed: number;
    itemsList: IItem[];
    balance: number;
    lvl: number;
    role: string;
    experience: number;
    gotReward: boolean;
}