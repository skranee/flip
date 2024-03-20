import {IUser} from "./IUser";

export default interface ILinkedCode {
    user: string | IUser,
    linkedCode: string,
    usages: number
}