import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Spinner} from "reactstrap";
import InputText from "../form/form-item/InputText";
import MessageInput from "../form/form-item/msg-input";
import {UserApi} from "../../api/main/user";
import {toast} from "react-toastify";

const formatCurrency = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat().format(price);
};

const MoneyRequestModalContent = ({modalEvent, handleClose, fetchMoneyRequests}) => {
    console.log('modalEvent', modalEvent)
    const [formData, setFormData] = useState({
        price: null,
        user_phone: null,
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [formDataLoading, setFormDataLoading] = useState(false)
    const isFormValid =
        Boolean(parseInt(formData.price));

    useEffect(() => {
        if (modalEvent.modalEventType === 'Edit') {
            setFormDataLoading(true)
            UserApi.getSingleRequestMoney(modalEvent.requestId).then(({data}) => {
                console.log('data', data)
                setFormData({
                    user_phone: data.response_user.phone,
                    price: data.price,
                    message: data.message
                })
            }).finally(() => setFormDataLoading(false));
        }
    }, []);

    const handleEditSubmit = async (id) => {
        try {
            setLoading(true)
            await UserApi.editWalletRequest(id, formData);
            toast.success('Money request updated');
            fetchMoneyRequests();
            handleClose()
        } catch (e) {
            console.error(e);
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }
    const handleDelete = async (id)  => {
        try {
            setLoading(true);
            await UserApi.deleteWalletRequest(id);
            toast.success('Money request deleted');
            fetchMoneyRequests();
            handleClose();
        } catch (e) {
            toast.error('Something went wrong')
            console.error(e)
        } finally {
             setLoading(false)
        }
    }
    switch (modalEvent.modalEventType) {
        case 'Edit': {
            return <div className='request-money__wrapper'>
                {formDataLoading && <div className="form-loader">
                    <Spinner
                        color="primary"
                        style={{
                            height: '3rem',
                            width: '3rem'
                        }}
                    >
                        Loading...
                    </Spinner></div>}
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
                    onClick={() => handleEditSubmit(modalEvent.requestId)}
                    className='btn btn-success mt-3'
                >
                    Request money {loading && <Spinner color='dark' size='sm'/>}
                </button>
            </div>
        }
        case "Delete": {
            return <div>
                <h3>Are you sure to delete?</h3>
                <ButtonGroup className="mt-4">
                    <Button color="danger" disabled={loading} onClick={() => handleDelete(modalEvent.requestId)}>
                        Yes {loading && <Spinner color='dark' size='sm'/>}
                    </Button>
                    <Button onClick={handleClose} color="secondary" outline>
                        No
                    </Button>
                </ButtonGroup>
            </div>
        }
    }

    return null;
};

export default MoneyRequestModalContent;
