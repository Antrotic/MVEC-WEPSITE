import React from "react";
import { useSelector } from "react-redux";
import TimerFlashFillIcon from "remixicon-react/TimerFlashFillIcon";
import GetWorkingHours from "./get-working-hours";
function TimeRange() {
  const shop = useSelector((state) => state.stores.currentStore);

  return (
    <div className="time-range">
      <div className="time">
        <div className="icon">
          <TimerFlashFillIcon size={20} />
        </div>
        <GetWorkingHours shop={shop} />
      </div>
    </div>
  );
}

export default TimeRange;
