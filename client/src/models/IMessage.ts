import {IUser} from "./IUser";

export default interface IMessage {
    user: IUser,
    message: string,
    time: string,
    id: string,
    avatar: string,
    removal: number
}