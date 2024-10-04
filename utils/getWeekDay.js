import dayjs from "dayjs";
import i18next from "i18next";

export default function getWeekDay(day) {
  const isToday = day.isSame(dayjs());
  const isTomorrow = day.isSame(dayjs().add(1, "day"));

  if (isToday) {
    return i18next.t("today");
  } else if (isTomorrow) {
    return i18next.t("tomorrow");
  } else {
    return day.format("dddd");
  }
}
