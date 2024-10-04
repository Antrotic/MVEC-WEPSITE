import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getNotification } from "../../utils/getNotification";
import {
  fetchNotification,
  fetchNotificationStats,
} from "../../redux/slices/notification";

export default function PushNotification() {
  const { t: tl } = useTranslation();
  const audioPlayer = useRef();
  const [notificationData, setNotificationData] = useState(null);
  const settings = useSelector((state) => state.settings.data, shallowEqual);
  const userId = useSelector((state) => state.user?.data?.id, shallowEqual);
  const dispatch = useDispatch();

  const notify = () => {
    audioPlayer.current.play();
    toast(
      <div className="notification-body">
        <div className="title">{`${tl("Order")}_${
          notificationData?.title
        }`}</div>
        <div className="text">{notificationData?.body}</div>
      </div>,
      { hideProgressBar: true, className: "custom-toast" }
    );
  };
  useEffect(() => {
    if (notificationData?.title && userId) {
      batch(() => {
        dispatch(
          fetchNotification({ type: "notification", perPage: 10, page: 1 })
        );
        dispatch(fetchNotificationStats({ type: "notification" }));
      });
      notify();
    }
  }, [notificationData, userId]);

  useEffect(() => {
    if (Object.keys(settings).length && userId)
      getNotification({
        vapid_key: settings.vapid_key,
        setNotificationData,
      });
  }, [notificationData, Object.keys(settings).length, userId]);
  return (
    <div className="notification">
      <audio allow="autoplay" ref={audioPlayer}>
        <source src={"/assets/media/web_whatsapp.mp3"} type="audio/mpeg" />
      </audio>
    </div>
  );
}
