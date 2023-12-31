import $api from "../http";
import {IUser} from "../models/IUser";
import {IItem} from "../models/IItem";
import {AxiosResponse} from "axios";
import IGame from "../models/IGame";

export default class GameService {
    static async createGame(player1: IUser, items: IItem[]): Promise<AxiosResponse> {
        return $api.post('/game', {player1, items});
    }

    static async getGames(): Promise<AxiosResponse<IGame[]>> {
        return $api.get('/game');
    }

    static async endGame(gameId: string): Promise<AxiosResponse> {
        return $api.post('/endGame', {gameId});
    }
}