import {IUser} from "./IUser";

export interface IAffiliate {
    user: IUser,
    affiliatedUsers: number,
    affiliatedBalance: number,
    affiliateCode: string,
    affiliateLink: string
}