import React, { useState } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  TabPane,
} from "reactstrap";
import moment from "moment";
import Pagination from "rc-pagination";
import classnames from "classnames";
import SEO from "../../components/seo";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ListHeadeer from "../../components/order-history/list-header";
import { OrderTemplateApi } from "../../api/main/orderTemplate";
import ListHeader from "../../components/order-template/list-header";
import ListItem from "../../components/order-template/list-item";
import RiveResult from "../../components/loader/rive-result";
import Drawer from "../../components/drawer";
import useQueryParams from "../../hooks/useQueryParams";
import DeliveryStatus from "../../components/order-history/delivery-status";
import MyModal from "../../components/modal";
import AutoOrder from "../../components/auto-order";
import useModal from "../../hooks/useModal";
import {toast} from "react-toastify";

const tabs = [
  { tabId: "all", tabName: "All" },
  { tabId: "active", tabName: "Active" },
  { tabId: "expired", tabName: "Expired" },
];

function OrderTemplate() {
  const user = useSelector((state) => state.user.data);
  const { query, removeQueryParams } = useQueryParams();
  const [open, handleOpen, handleClose] = useModal();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActivetab] = useState("all");
  const [autoOrders, setAutoOrders] = useState({ data: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [expired, setExpired] = useState(undefined);
  const [active, setActive] = useState(undefined);
  const [beforeOrderedData, setBeforeOrderedData] = useState();
  const [autoOrderData, setAutoOrderData] = useState({
    start_date: null,
    end_date: null,
    id: null,
  });

  const isAutoOrderDataValid =
    autoOrderData.start_date && autoOrderData.end_date;

  const { orderId } = query;

  const toggle = (tab) => {
    if (activeTab === tab) return;
    setTotal("");
    if (tab === "active") {
      setActive(1);
      setExpired(undefined);
    } else if (tab === "expired") {
      setExpired(1);
      setActive(undefined);
    } else {
      setExpired(undefined);
      setActive(undefined);
    }
    setActivetab(tab);
    setCurrentPage(1);
    // handleChangeQueryParam({ tab });
  };

  const updateAutoOrder = (autoOrder) => {
    setBeforeOrderedData({
      from: new Date(autoOrder?.date?.start_date),
      to: new Date(autoOrder?.date?.end_date),
    });
    setAutoOrderData({
      start_date: new Date(),
      end_date: null,
      id: autoOrder?.id,
    });
    handleOpen();
  };

  const getOrderHistory = () => {
    if (!user) return;
    setLoading(true);
    OrderTemplateApi.get({
      page: currentPage,
      // status: tab || activeTab,
      expired,
      active,
      perPage: 8,
      // user_id: user.id,
    })
      .then((res) => {
        setAutoOrders(res);
        setTotal(res.meta.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrderHistory();
  }, [activeTab, currentPage]);

  useEffect(() => {
    if (orderId) {
      setDrawerVisible(true);
      setCurrentOrderId(orderId);
    }
  }, [orderId]);

  const handleEditAutoOrder = async () => {
    try {
      setLoading(true);
      const dataToSubmit = {
        "date[start_date]": moment(autoOrderData.start_date).format(
          "YYYY-MM-DD"
        ),
        "date[end_date]": moment(autoOrderData.end_date).format("YYYY-MM-DD"),
        type: "fix",
      };

      await OrderTemplateApi.updateTemplateDate(autoOrderData.id, dataToSubmit);
      getOrderHistory();
      handleClose();
    } catch (error) {
      toast.error(error.message)
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO />
      <Nav tabs>
        {tabs.map((data) => (
          <NavItem key={data.tabId}>
            <NavLink
              className={classnames({ active: activeTab === data.tabId })}
              onClick={() => {
                toggle(data.tabId);
              }}
            >
              <div>{data.tabName}</div>
              {activeTab === data.tabId && <div className="count">{total}</div>}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      {loading ? (
        <div className="container-full">
          <Spinner />
        </div>
      ) : (
        <TabContent activeTab={activeTab}>
          {tabs.map((tabItem) => (
            <TabPane key={tabItem.tabId} tabId={tabItem.tabId}>
              <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: "740px" }}>
                  <ListHeader activeTab={activeTab} />
                  {autoOrders?.data?.map((autoOrder) => (
                    <ListItem
                      updateAutoOrder={updateAutoOrder}
                      key={autoOrder.id}
                      autoOrder={autoOrder}
                    />
                  ))}
                </div>
              </div>

              {autoOrders?.data?.length == 0 && (
                <RiveResult text="Orders not found" />
              )}
            </TabPane>
          ))}
        </TabContent>
      )}

      {autoOrders?.data?.length > 0 && (
        <>
          <Pagination
            pageSize={8}
            onChange={(p) => setCurrentPage(p)}
            current={currentPage}
            total={autoOrders.meta.total}
            className="mt-4"
          />
        </>
      )}
      <Drawer
        visible={drawerVisible}
        setVisible={(value) => {
          removeQueryParams(["orderId"]);
          setDrawerVisible(value);
        }}
        title="Order history"
      >
        <DeliveryStatus
          getOrderHistory={getOrderHistory}
          currentOrderId={currentOrderId}
          setVisible={(value) => {
            removeQueryParams(["orderId"]);
            setDrawerVisible(value);
          }}
        />
      </Drawer>
      <MyModal
        title="Update auto order"
        visible={open}
        handleClose={handleClose}
        centered
      >
        <div className="mx-auto p-4">
          <AutoOrder
            autoOrderData={autoOrderData}
            setAutoOrderData={setAutoOrderData}
            beforeOrderedData={beforeOrderedData}
          />
          <button
            disabled={!isAutoOrderDataValid || loading}
            className="btn w-100 btn-dark"
            onClick={handleEditAutoOrder}
          >
            Submit{" "}
            {loading && (
              <Spinner color="primary" size="sm">
                Loading...
              </Spinner>
            )}
          </button>
        </div>
      </MyModal>
    </>
  );
}

export default OrderTemplate;
