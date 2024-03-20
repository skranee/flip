import {IUser} from "./IUser";
import {IItem} from "./IItem";

export default interface IGame {
    player1: IUser,
    player2: IUser,
    gameId: string,
    items1: IItem[],
    items2: IItem[],
    side1: string,
    side2: string,
    status: string,
    result: string,
    gems1: number,
    gems2: number,
    checkLink: string
}