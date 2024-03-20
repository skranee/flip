export default interface IPayment {
    user: string,
    address: string,
    usdAmount: number,
    paymentCurrency: string,
    receivedBalance: number
}