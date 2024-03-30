import $api from "../http";
import {IUser} from "../models/IUser";
import {IItem} from "../models/IItem";
import {AxiosResponse} from "axios";
import IGame from "../models/IGame";

export default class GameService {
    static async createGame(items: IItem[], side: string): Promise<AxiosResponse> {
        return $api.post('/game', {items, side});
    }

    static async createWithGems(gemsAmount: number, side: string): Promise<AxiosResponse> {
        return $api.post('/createWithGems', {gemsAmount, side});
    }

    static async joinGame(items: IItem[], side: string, gameId: string): Promise<AxiosResponse> {
        return $api.patch('/game', {items, side, gameId});
    }

    static async joinWithGems(side: string, gameId: string, gemsAmount: number): Promise<AxiosResponse> {
        return $api.patch('/joinWithGems', {side, gameId, gemsAmount});
    }

    static async cancelGame(game: IGame): Promise<AxiosResponse> {
        return $api.post('/cancelGame', {game});
    }

    static async getGames(): Promise<AxiosResponse<IGame[]>> {
        return $api.get('/game');
    }
}