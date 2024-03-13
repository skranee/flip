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
    chatOpened = true;
    panelOpen = true;
    adminModal = false;
    adminOptionStatus = '';
    cryptoOpen = false;
    crAddress = 'Waiting...';
    addressWindow = false;
    withdrawOpen = false;
    cancelSale = false;
    paymentsOpen = false;
    gemJoin = false;
    gemCreate = false;
    checkLink = '';
    connectModal = false;
    withdrawStatus = '';
    botRecommended = '';
    errorWindow = false;
    errorMessage = '';
    giveawayGoing = false;
    giveawayData = {};
    giveawayParticipants = [];
    giveawayWinner = '';
    allowedToParticipate = false;
    seeGiveaway = false;

    constructor() {
        makeAutoObservable(this)
    }

    setSeeGiveaway(bool) {
        this.seeGiveaway = bool;
    }

    setAllowedToParticipate(bool) {
        this.allowedToParticipate = bool;
    }

    setGiveawayWinner(winner) {
        this.giveawayWinner = winner;
    }

    setGiveawayTimer(time) {
        if(this.giveawayData && this.giveawayData.timer) {
            this.giveawayData.timer = time;
        }
    }

    setGiveawayParticipants(users) {
        this.giveawayParticipants = users;
    }

    setGiveawayData(data) {
        this.giveawayData = data;
    }

    setGiveawayGoing(bool) {
        this.giveawayGoing = bool;
    }

    setErrorMessage(message) {
        this.errorMessage = message;
    }

    setErrorWindow(bool) {
        this.errorWindow = bool;
    }

    setBotRecommended(botName) {
        this.botRecommended = botName;
    }

    setWithdrawStatus(status) {
        this.withdrawStatus = status;
    }

    setConnectModal(bool) {
        this.connectModal = bool;
    }

    setCheckLink(link) {
        this.checkLink = link;
    }

    setGemCreate(bool) {
        this.gemCreate = bool;
    }

    setGemJoin(bool) {
        this.gemJoin = bool;
    }

    setPaymentsOpen(bool) {
        this.paymentsOpen = bool;
    }

    setCancelSale(bool) {
        this.cancelSale = bool;
    }

    setWithdrawOpen(bool) {
        this.withdrawOpen = bool;
    }

    setAddressWindow(bool) {
        this.addressWindow = bool;
    }

    setCryptoAddress(address) {
        this.crAddress = address;
    }

    setCryptoOpen(bool) {
        this.cryptoOpen = bool;
    }

    setAdminOptionStatus(status) {
        this.adminOptionStatus = status;
    }

    setAdminModal(bool) {
        this.adminModal = bool;
    }

    setPanelOpen(bool) {
        this.panelOpen = bool;
    }

    setChatOpened(bool) {
        this.chatOpened = bool;
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