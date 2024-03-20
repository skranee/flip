import {IUser} from "./IUser";

export default interface IHistory {
    player1: IUser,
    player2: IUser,
    totalWorth: number,
    data: string,
    result: string
}