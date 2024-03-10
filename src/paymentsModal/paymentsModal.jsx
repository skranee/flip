import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {Context} from "../index";
import PaymentsList from "./paymentsList";

function PaymentsModal() {
    const {store, globalStore} = useContext(Context);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const getPaymentsData = async () => {
            const response = await store.getPayments(store.user.id);
            if(response && response.data) {
                setPayments(response.data);
            }
        }
        getPaymentsData();
    }, [store]);

    const handleBlur = () => {
        globalStore.setPaymentsOpen(false);
    }

    return (
        <div className='backgroundModal' onClick={handleBlur}>
            <div
                className='modalWindowDeposit'
                style={{justifyContent: "flex-start"}}
                onClick={(event) => event.stopPropagation()}
            >
                <span className='upperTextPayments'>YOUR PAYMENTS</span>
                <div className='paymentsSpace'>
                    <PaymentsList payments={payments} />
                </div>
            </div>
        </div>
    )
}

export default observer(PaymentsModal);