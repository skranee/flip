import $api from "../http";
import {IUser} from "../models/IUser";
import {IItem} from "../models/IItem";
import {AxiosResponse} from "axios";
import IGame from "../models/IGame";
import {WinnerResponse} from "../models/response/WinnerResponse";

export default class GameService {
    static async createGame(player1: IUser, items: IItem[], side: string): Promise<AxiosResponse> {
        return $api.post('/game', {player1, items, side});
    }

    static async createWithGems(player1: IUser, gemsAmount: number, side: string): Promise<AxiosResponse> {
        return $api.post('/createWithGems', {player1, gemsAmount, side});
    }

    static async joinGame(player2: IUser, items: IItem[], side: string, gameId: string): Promise<AxiosResponse> {
        return $api.patch('/game', {player2, items, side, gameId});
    }

    static async joinWithGems(player2: IUser, side: string, gameId: string, gemsAmount: number): Promise<AxiosResponse> {
        return $api.patch('/joinWithGems', {player2, side, gameId, gemsAmount});
    }

    static async cancelGame(user: IUser, game: IGame): Promise<AxiosResponse> {
        return $api.post('/cancelGame', {user, game});
    }

    static async getGames(): Promise<AxiosResponse<IGame[]>> {
        return $api.get('/game');
    }
}