import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import {getPrice} from "../../utils/getPrice";
import DiscordLoader from "../loader/discord-loader";
import React, {useEffect, useState} from "react";
import {PaymentApi} from "../../api/main/payment";
import {shallowEqual, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

export default function PaymentSelect({handlePayment, selectedPayment, currentMoneyBack, disableCash}) {
    const {t: tl} = useTranslation();
    const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
    const getPayment = () => {
        PaymentApi.get({shop_id: shop?.id})
            .then((res) => {
                if (disableCash) {
                    setPaymentType(res.data.filter(paymentType => paymentType.payment.tag !== 'cash'))
                } else {
                    setPaymentType(res.data);
                }

            })
            .catch((error) => {
                console.error(error);
            });
    };
    const [paymentType, setPaymentType] = useState();
    useEffect(() => {
        getPayment();
    }, []);
    return (<div style={{height: 'fit-content'}} className='payment'>
        <div className='method'>
            <div className='title'>{tl("Payment method")}</div>
            <div className='method-items'>
                {paymentType ? (paymentType?.map((type, key) => (<div
                    key={key}
                    className='method-item'
                    onClick={() => handlePayment(type)}
                >
                    <div
                        className={`icon ${selectedPayment?.id === type.payment.id && "select"}`}
                    >
                        {selectedPayment?.id === type.payment.id ? (<CheckboxCircleFillIcon/>) : (
                            <CheckboxBlankCircleLineIcon/>)}
                    </div>
                    <div className='label'>
                        {type.payment.translation.title}
                        {/* In "cash" option, showing money back amount logic*/}
                        {type.payment.tag === "cash" && currentMoneyBack !== undefined && selectedPayment?.id === type.payment.id && (currentMoneyBack === 0 ? " (No need of MoneyBack)" : ` (MoneyBack ${getPrice(currentMoneyBack)})`)}
                    </div>
                </div>))) : (<DiscordLoader/>)}
            </div>
        </div>
    </div>)
}

