import React from 'react';
import gem from "../imgs/currImg.png";

function PaymentsList({payments}) {
    return (
        payments.map((item, index) => (
                <li key={index} className='paymentContainer'>
                    <div className='paymentInnerInfo'>
                        <a className='upperPaymentInnerInfo'>Address:</a>
                        <a className='mainPaymentInnerInfo'>{item.address}</a>
                    </div>
                    <div className='paymentInnerInfo'>
                        <a className='upperPaymentInnerInfo'>USD:</a>
                        <a className='mainPaymentInnerInfo'>{item.usdAmount.toFixed(3)}</a>
                    </div>
                    <div className='paymentInnerInfo'>
                        <a className='upperPaymentInnerInfo'>Currency:</a>
                        <a className='mainPaymentInnerInfo'>{item.paymentCurrency}</a>
                    </div>
                    <div className='paymentInnerInfo'>
                        <a className='upperPaymentInnerInfo'>Received: </a>
                        <a className='mainPaymentInnerInfo'>{item.receivedBalance} <img src={gem} className='gemWorth' alt='' /></a>
                    </div>
                </li>
            ))
    )
}

export default PaymentsList;