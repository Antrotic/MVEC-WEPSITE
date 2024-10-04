import moment from "moment";
import React from "react";

const ChatTime = ({ time }) => {
  return (
    <div className="time">
      {time !== "Invalid Date" ? (
        moment(new Date(time)).format("HH:mm")
      ) : (
        <div class="loader-container">
          <span class="text-loader"></span>
        </div>
      )}
    </div>
  );
};

export default ChatTime;
