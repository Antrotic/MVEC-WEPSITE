import React, { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import getTimeSlots, {
  minutesToString,
  stringToMinutes,
} from "../../utils/getTimeSlots";
import dayjs from "dayjs";
import checkIsDisabledDay from "../../utils/checkIsDisabledDay";
import { WEEK } from "../../constants/weekdays";
import getWeekDay from "../../utils/getWeekDay";
import RiveResult from "../loader/rive-result";
import { setDeliveryTime } from "../../redux/slices/cart";
import { handleVisibleStoreInfo } from "../../redux/slices/mainState";

function DeliveryTime() {
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [list, setList] = useState([]);

  const renderTimes = useCallback(() => {
    let today = dayjs().add(dayIndex, "day");
    const isToday = today.isSame(dayjs());
    const weekDay = WEEK[today.day()];
    const workingSchedule = shop?.shop_working_days?.find((item) =>
      item.day.toUpperCase().includes(weekDay.toUpperCase())
    );

    if (workingSchedule && !checkIsDisabledDay(dayIndex, shop)) {
      const from = workingSchedule.from.replace("-", ":");
      const to = workingSchedule.to.replace("-", ":");
      const slots = getTimeSlots(from, to, isToday);
      setList(slots);
      setSelectedValue(null);
    } else {
      setList([]);
      setSelectedValue(null);
    }
  }, [dayIndex, shop]);

  function renderDeliverySchedule(time) {
    let from = stringToMinutes(time);
    let to = parseInt(shop?.delivery_time?.to || "0");
    if (shop?.delivery_time?.type === "hour") {
      to = parseInt(shop.delivery_time.to) * 60;
    }
    const deliveryTime = minutesToString(from + to);
    return `${time} - ${deliveryTime}`;
  }

  function renderDay(index) {
    const day = dayjs().add(index, "day");
    return {
      day,
      weekDay: getWeekDay(day),
    };
  }

  const submit = (selectedValue) => {
    setSelectedValue(selectedValue);
    const delivery_time = renderDeliverySchedule(selectedValue);
    const delivery_date = dayjs().add(dayIndex, "day").format("YYYY-MM-DD");
    dispatch(
      setDeliveryTime({ delivery_time, delivery_date, shop_id: shop?.id })
    );
    dispatch(handleVisibleStoreInfo(false));
  };

  useEffect(() => {
    renderTimes();
  }, [shop, renderTimes]);

  return (
    <div className="delivery-date-wrapper">
      <div className="week-days">
        {WEEK.map((day, idx) => {
          return (
            <div
              key={`day${idx}`}
              className={`tab ${dayIndex === idx ? "active" : ""}`}
              onClick={() => setDayIndex(idx)}
            >
              <span className={"text"}>{renderDay(idx).weekDay}</span>
              <span className={"subText"}>
                {renderDay(idx).day.format("MMM DD")}
              </span>
            </div>
          );
        })}
      </div>
      {list?.map((item, key) => (
        <div key={key} className="delivery-date" onClick={() => submit(item)}>
          {selectedValue === item && <span />}
          <div className="time">{renderDeliverySchedule(item)}</div>
        </div>
      ))}
      {list.length === 0 && (
        <RiveResult id="noresult" text="shop.closed.choose.other.day" />
      )}
    </div>
  );
}

export default DeliveryTime;
