import {IUser} from "./IUser";

export default interface ISupport {
    message: string,
    userId: IUser,
    answered: boolean
}