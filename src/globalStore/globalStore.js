import {makeAutoObservable} from "mobx";

export default class GlobalStore {
    logOpen = false;
    gamesJoin = 0;
    gamesAll = 0;
    titleHL = 'Sort';
    titleAll = 'All';
    viewOpen = false;
    gameInfo = null;
    streamLive = false;
    profileUser = {};
    profileAv = '';
    profileOpen = false;
    createOpen = false;
    historyOpen = false;
    openAnswers = false;
    buyOpen = false;
    depositOpen = false;
    sellOpen = false;
    sellItemOpen = false;
    itemsOnSale = false;
    joinOpen = false;

    constructor() {
        makeAutoObservable(this)
    }

    setLogOpen(bool) {
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

    setViewOpen(bool) {
        this.viewOpen = bool;
    }

    setGameInfo(obj) {
        this.gameInfo = obj;
    }

    setStreamLive(bool) {
        this.streamLive = bool;
    }

    setProfileUser(user) {
        this.profileUser = user;
    }

    setProfileAv(av) {
        this.profileAv = av;
    }

    setProfileOpen(bool) {
        this.profileOpen = bool;
    }

    setCreateOpen(bool) {
        this.createOpen = bool;
    }

    setHistoryOpen(bool) {
        this.historyOpen = bool;
    }

    setOpenAnswers(bool) {
        this.openAnswers = bool;
    }

    setBuyOpen(bool) {
        this.buyOpen = bool;
    }

    setDepositOpen(bool) {
        this.depositOpen = bool;
    }

    setSellOpen(bool) {
        this.sellOpen = bool;
    }

    setSellItemOpen(bool) {
        this.sellItemOpen = bool;
    }

    setItemsOnSale(bool) {
        this.itemsOnSale = bool;
    }

    setJoinOpen(bool) {
        this.joinOpen = bool;
    }
}