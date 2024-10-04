import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { shallowEqual, useSelector } from "react-redux";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import { useTranslation } from "react-i18next";
import { Spinner } from "reactstrap";
import InputText from "../form/form-item/InputText";
import MessageInput from "../form/form-item/msg-input";
import { PaymentApi } from "../../api/main/payment";
import DiscordLoader from "../loader/discord-loader";
import { WalletApi } from "../../api/main/wallet";
import { TransactionsApi } from "../../api/main/transactions";
import { MainContext } from "../../context/MainContext";

const formatCurrency = (price) => {
  if (!price) return "";
  return new Intl.NumberFormat().format(price);
};

const AddWallet = ({ onFinish }) => {
  const { getUser } = useContext(MainContext);
  const { t: tl } = useTranslation();
  // const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const walletId = useSelector((state) => state.user.data?.wallet?.id);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [value, setValue] = useState(0);
  const [note, setNote] = useState("");

  const isFormValid = parseInt(value) && selectedPayment;

  const getPayment = () => {
    PaymentApi.get({wallet_topup: 0})
      .then(({ data }) => {
        const newData = data?.filter((item) => item.payment.tag !== "wallet");
        setPaymentType(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getPayment();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      price: value,
      note,
    };
    try {
      await TransactionsApi.topUpWallet(walletId, {
        payment_sys_id: selectedPayment.id,
        price: value,
      });
      await WalletApi.topUpWallet(data);
      toast.success("Wallet top up succeeded");
    } catch (error) {
      console.log("err", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      getUser();
      onFinish();
    }
  };

  return (
    <div className="add-wallet">
      <div className="add-wallet__wrapper">
        <div className="add-wallet__form">
          <InputText
            label="Amount"
            placeholder="0"
            value={formatCurrency(value)}
            onChange={(e) => {
              const rawValue = e.target.value;
              const cleanedValue = rawValue.replace(/[^0-9.]/g, "");
              setValue(cleanedValue);
            }}
          />
          <div className="method">
            <div className="title">{tl("Payment method")}</div>
            <div className="method-items">
              {paymentType ? (
                paymentType?.map((type, key) => (
                  <div
                    key={key}
                    className="method-item"
                    onClick={() => setSelectedPayment(type)}
                  >
                    <div
                      className={`icon ${
                        selectedPayment?.id === type.id && "select"
                      }`}
                    >
                      {selectedPayment?.id === type.id ? (
                        <CheckboxCircleFillIcon />
                      ) : (
                        <CheckboxBlankCircleLineIcon />
                      )}
                    </div>
                    <div className="label">
                      {type.payment.translation.title}
                    </div>
                  </div>
                ))
              ) : (
                <DiscordLoader />
              )}
            </div>
          </div>
          <MessageInput
            label
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button
          disabled={!isFormValid || loading}
          onClick={handleSubmit}
          className="btn btn-success"
        >
          Top up wallet {loading && <Spinner color="dark" size="sm" />}
        </button>
      </div>
    </div>
  );
};

export default AddWallet;
