export default function roundedDeliveryTime(date, minuteToAdd) {
  const deliveryTime = date.format("HH:mm");
  const minutes = Number(deliveryTime.split(":")[1]);
  const rounded = Math.ceil(minutes / 5) * 5;
  const leftMinutes = rounded - minutes + minuteToAdd;
  return date.add(leftMinutes, "minute").format("HH:mm");
}
