import React from 'react';
import gem from "../imgs/currImg.png";

function PaymentsList({payments}) {
    return (
        payments.map((item, index) => (
                <li key={index} className='paymentContainer'>
                    <div className='paymentInnerInfo'>
                        <span className='upperPaymentInnerInfo'>Address:</span>
                        <span className='mainPaymentInnerInfo'>{item.address}</span>
                    </div>
                    <div className='paymentInnerInfo'>
                        <span className='upperPaymentInnerInfo'>USD:</span>
                        <span className='mainPaymentInnerInfo'>{item.usdAmount.toFixed(3)}</span>
                    </div>
                    <div className='paymentInnerInfo'>
                        <span className='upperPaymentInnerInfo'>Currency:</span>
                        <span className='mainPaymentInnerInfo'>{item.paymentCurrency}</span>
                    </div>
                    <div className='paymentInnerInfo'>
                        <span className='upperPaymentInnerInfo'>Received: </span>
                        <span className='mainPaymentInnerInfo'>{item.receivedBalance} <img src={gem} className='gemWorth' alt='' /></span>
                    </div>
                </li>
            ))
    )
}

export default PaymentsList;