import {makeAutoObservable} from "mobx";

export default class GlobalStore {
    logOpen = false;
    gamesJoin = 3;
    gamesAll = 8;
    titleHL = 'Sort';
    titleAll = 'All';

    constructor() {
        makeAutoObservable(this)
    }

    setLogOpen (bool) {
        this.logOpen = bool;
    }

    setGamesJoin(num) {
        this.gamesJoin = num;
    }

    setGamesAll(num) {
        this.gamesAll = num;
    }

    setTitleHL(title) {
        this.titleHL = title;
    }

    setTitleAll(title) {
        this.titleAll = title;
    }
}