import {IItem} from "../IItem";

export interface WithdrawResponse {
    userId: string,
    items: IItem[]
}