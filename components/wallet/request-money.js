import React, {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Spinner} from "reactstrap";
import InputText from "../form/form-item/InputText";
import MessageInput from "../form/form-item/msg-input";
import InputPhone from "../form/form-item/InputPhone";
import {UserApi} from "../../api/main/user";
import {PhoneApi} from "../../api/main/phone";

const formatCurrency = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat().format(price);
};

const RequestMoney = ({onFinish}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        price: null,
        user_phone: null,
        message: "",
    });

    const isFormValid =
        Boolean(parseInt(formData.price) && formData?.user_phone?.length > 5 && formData?.message);

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const userExists = await PhoneApi.checkPhone({
                phone: formData.user_phone,
            });
            if (!userExists.data?.exist) return toast.error('User doesn\'t exist!');
            const res = await UserApi.createRequestMoney(formData);

            toast.success("Money request sent");
            onFinish();
        } catch (error) {
            console.log("err", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='request-money'>
            <div className='request-money__wrapper'>
                <div className='request-money__form'>
                    <InputText
                        label='Amount'
                        placeholder='0'
                        value={formatCurrency(formData.price)}
                        onChange={(e) => {
                            const rawValue = e.target.value;
                            const cleanedValue = rawValue.replace(/[^0-9.]/g, "");
                            setFormData((prev) => ({...prev, price: cleanedValue}));
                        }}
                    />
                    <div className='mt-4'>
                        <InputPhone
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    user_phone: e.target.value.replace(/[^\d\+]/g, ""),
                                }))
                            }
                            name='phone_to'
                            label='Receiver phone number'
                        />
                    </div>
                    <MessageInput
                        label
                        placeholder="Why are you requesting money?"
                        value={formData.message}
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, message: e.target.value}))
                        }
                    />
                </div>
                <button
                    disabled={!isFormValid || loading}
                    onClick={handleSubmit}
                    className='btn btn-success'
                >
                    Request money {loading && <Spinner color='dark' size='sm'/>}
                </button>
            </div>
        </div>
    );
};

export default RequestMoney;
