import Link from "next/link";
import React, { useCallback, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { images } from "../../constants/images";
import { BlogApi } from "../../api/main/blog";
import {
  markAllList,
  addToViewed,
} from "../../redux/slices/viewed-notification";
import DiscordLoader from "../loader/discord-loader";
import { NotificationApi } from "../../api/main/notification";
import Empty from "../empty-data";
import {
  fetchNotification,
  fetchNotificationStats,
} from "../../redux/slices/notification";
import { useRouter } from "next/router";

function Notification({ setVisible }) {
  const observer = useRef();
  const {
    notification: notificationList,
    loading,
    notificationStats: data,
    meta: initialMeta,
  } = useSelector((state) => state.notificationList, shallowEqual);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [type, setType] = useState("notification");
  const [meta, setMeta] = useState(initialMeta);
  const [loader, setLoader] = useState(false);
  const [loadedNotificationList, setLoadedNotificationList] = useState(
    notificationList || []
  );
  const router = useRouter();

  const { current_page, last_page } = meta || {};

  const CustomTabs = () => {
    const tabs = [
      {
        label: "all",
        type: "notification",
      },
      {
        label: "news",
        type: "news_publish",
      },
      {
        label: "orders",
        type: "status_changed",
      },
    ];

    const handleTabClick = ({ e, index, type }) => {
      e.stopPropagation();
      setActiveTab(index);
      setType(type);
    };

    return (
      <div className="custom-tabs">
        <div className="tab-buttons">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab-button ${activeTab === index ? "active" : ""}`}
              onClick={(e) => handleTabClick({ e, index, type: tab.type })}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleReadMessage = (item) => {
    const notificationDetailPageUrl = item.type === 'gift_product' ? '/my-gift-cards' : (item.type === 'wallet_request' ? '/money-requests' : `/order-history/?tab=${item.data?.status}&orderId=${item.title}`);
    handleNotification(item.id);
    router
      .push(notificationDetailPageUrl)
      .then(() => {
        if (!item.read_at) {
          NotificationApi.readById(item.id)
            .then(() =>
              batch(() => {
                dispatch(fetchNotification({ type }));
                dispatch(fetchNotificationStats({ type }));
              })
            )
            .catch((error) => {
              console.log(error);
            });
        }
        if(item.type === 'gift_product' || item.type === 'wallet_request') setVisible(false);
      });
  };

  const readAll = () => {
    // e.stopPropagation();
    NotificationApi.readAll({})
      .then(() => {
        batch(() => {
          dispatch(fetchNotification({ type }));
          dispatch(fetchNotificationStats({ type }));
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();

  // const getNotification = (type) => {
  //   dispatch(fetchNotification({ type, perPage: 10, page: 1 }));
  // };

  const getNotification = ({ page, perPage = 10, type }) => {
    setLoader(true);
    NotificationApi.get({ perPage, page, type })
      .then((res) => {
        setLoadedNotificationList((prev) => [...prev, ...res.data]);
        setMeta(res.meta);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoader(false));
  };

  const handleNotification = (value) => {
    dispatch(addToViewed(value));
  }

  const hasMore = Boolean(last_page > current_page);
  const lastBookElementRef = useCallback(
    (node) => {
      if (loader) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          getNotification({ type, perPage: 10, page: current_page + 1 });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loader, hasMore]
  );

  useEffect(() => {
    batch(() => {
      dispatch(fetchNotification({ type, perPage: 10, page: 1 }));
      dispatch(fetchNotificationStats({ type }));
    });
  }, [type]);

  useEffect(() => {
    setLoadedNotificationList(notificationList);
    setMeta(initialMeta);
  }, [notificationList]);
  return (
    <div className="notification-box">
      <CustomTabs />
      {loading ? (
        <DiscordLoader />
      ) : (
        loadedNotificationList?.map((item, key) => (
          <>
            <div
              className="notification-item"
              onClick={() => handleReadMessage(item)}
              key={item.id}
            >
              {!item.read_at && <span></span>}
              <div className="title">#{item.title}</div>
              <div className="content">{item.body}</div>
              <div className="date">
                <div className="day">{item.created_at?.slice(0, 16)}</div>
              </div>
            </div>
            <div ref={lastBookElementRef} />
          </>
        ))
      )}
      {!loadedNotificationList.length && !loading && (
        <Empty image={images.EmptyCart} text1="There are no notifications." />
      )}
      {loader && <DiscordLoader />}
      <div className="clear-btn" onClick={readAll}>
        {tl("Clear all")}
      </div>
    </div>
  );
}

export default Notification;
