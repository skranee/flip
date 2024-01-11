import {IUser} from "./IUser";
import {IItem} from "./IItem";

export default interface IGame {
    user1: IUser,
    user2: IUser,
    gameId: string,
    items1: IItem[],
    items2: IItem[],
    side1: string,
    side2: string,
    status: string
}