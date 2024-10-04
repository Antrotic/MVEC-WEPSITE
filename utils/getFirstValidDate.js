import dayjs from "dayjs";
import checkIsDisabledDay from "./checkIsDisabledDay";
import roundedDeliveryTime from "./roundedDeliveryTime";

function getSchedule(day, data) {
  return data?.shop_working_days?.find(
    (item) => item.day?.toLowerCase() === day.format("dddd").toLowerCase()
  );
}

export default function getFirstValidDate(data) {
  const estimatedDeliveryDuration = Number(data?.delivery_time?.to);
  let date = "";
  let time = "";
  for (let index = 0; index < 7; index++) {
    const isToday = index === 0;
    if (!checkIsDisabledDay(index, data)) {
      date = dayjs().add(index, "day").format("YYYY-MM-DD");
      if (isToday) {
        time = roundedDeliveryTime(
          dayjs().add(index, "day").add(estimatedDeliveryDuration, "minute"),
          estimatedDeliveryDuration
        );
      } else {
        const day = dayjs().add(index, "day");
        const foundedSchedule = getSchedule(day, data);
        const openTime = foundedSchedule?.from?.replace("-", ":");
        time = roundedDeliveryTime(
          dayjs(`${date} ${openTime}`),
          estimatedDeliveryDuration
        );
      }
      break;
    }
  }
  return {
    date,
    time,
  };
}
