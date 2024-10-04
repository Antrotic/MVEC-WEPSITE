import React, { useState } from "react";
import {
    Spinner,
    TabContent,
    TabPane,
} from "reactstrap";
import Pagination from "rc-pagination";
import SEO from "../../components/seo";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ListHeader from "../../components/money-requests/list-header";
import ListItem from "../../components/money-requests/list-item";
import RiveResult from "../../components/loader/rive-result";
import {UserApi} from "../../api/main/user";
import MyModal from "../../components/modal";
import useModal from "../../hooks/useModal";
import MoneyRequestModalContent from "../../components/wallet-request-modal";

const tabs = [
    { tabId: "income_requests", tabName: "Income requests" },
    { tabId: "my_requests", tabName: "My requests" }
];

function MoneyRequests() {
    const user = useSelector((state) => state.user.data);
    const [open, handleOpen, handleClose] = useModal();
    const [activeTab, setActiveTab] = useState("income_requests");
    const [moneyRequests, setMoneyRequests] = useState({ data: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalEvent, setModalEvent] = useState({})

    const openModalHandler = (modalEvent) => {
        setModalEvent(modalEvent)
        handleOpen();
    }

    const fetchMoneyRequests = () => {
        if (!user) return;
        setLoading(true);
        UserApi.getRequestMoney({
            page: currentPage,
            perPage: 10,
        })
            .then((res) => {
                setMoneyRequests(res)
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMoneyRequests();
    }, [ currentPage]);

    return (
        <>
            <SEO />
            {loading ? (
                <div className="container-full">
                    <Spinner />
                </div>
            ) : (
                <TabContent activeTab={activeTab}>
                    {tabs.map((tabItem) => (
                        <TabPane key={tabItem.tabId} tabId={tabItem.tabId}>
                            <div style={{ overflowX: "auto" }}>
                                <div style={{ minWidth: "880px" }}>
                                    <ListHeader activeTab={activeTab} />
                                    {moneyRequests?.data?.map((moneyRequest) => (
                                        <ListItem
                                            key={moneyRequest?.id}
                                            moneyRequest={moneyRequest}
                                            openModalHandler={openModalHandler}
                                            fetchMoneyRequests={fetchMoneyRequests}
                                        />
                                    ))}
                                </div>
                            </div>

                            {moneyRequests?.data?.length === 0 && (
                                <RiveResult text="Orders not found" />
                            )}
                        </TabPane>
                    ))}
                </TabContent>
            )}
            <MyModal
                visible={open}
                handleClose={handleClose}
                className='address-modal'
                centered={true}
                title={modalEvent.modalEventType}
            >
                <MoneyRequestModalContent modalEvent={modalEvent} handleClose={handleClose} fetchMoneyRequests={fetchMoneyRequests}/>
            </MyModal>

            {moneyRequests?.data?.length > 0 && (
                <>
                    <Pagination
                        pageSize={10}
                        onChange={(p) => setCurrentPage(p)}
                        current={currentPage}
                        total={moneyRequests.meta.total}
                        className="mt-4"
                    />
                </>
            )}
        </>
    );
}

export default MoneyRequests;
