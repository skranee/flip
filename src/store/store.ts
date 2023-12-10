import {makeAutoObservable} from "mobx";

export default class Store {
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this)
    }

    setAuth (bool: boolean) {
        this.isAuth = bool;
    }

    setLoading (bool: boolean) {
        this.isLoading = bool;
    }
}