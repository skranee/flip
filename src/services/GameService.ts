import $api from "../http";
import {IUser} from "../models/IUser";
import {IItem} from "../models/IItem";
import {AxiosResponse} from "axios";
import IGame from "../models/IGame";

export default class GameService {
    static async createGame(player1: IUser, items: IItem[], side: string): Promise<AxiosResponse> {
        return $api.post('/game', {player1, items, side});
    }

    static async joinGame(player2: IUser, items: IItem[], side: string, gameId: string): Promise<AxiosResponse> {
        return $api.patch('/game', {player2, items, side, gameId});
    }

    static async getGames(): Promise<AxiosResponse<IGame[]>> {
        return $api.get('/game');
    }

    static async endGame(gameId: string): Promise<AxiosResponse> {
        return $api.post('/endGame', {gameId});
    }
}