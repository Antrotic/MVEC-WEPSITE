import React from "react";
import { Message } from "@chatscope/chat-ui-kit-react";
import ChatTime from "./helper/getTime";

const AdminMessage = ({ text, time, chat_img }) => {
  return (
    <div className="admin-message-wrapper">
      <div className={`admin-message ${chat_img && "chat-image"}`}>
        {chat_img && (
          <Message
            type="image"
            model={{
              direction: "incoming",
              payload: {
                src: chat_img,
                alt: "Joe avatar",
                width: "100%",
                height: "100%",
              },
            }}
          />
        )}
        {text && <div className="text">{text}</div>}
        <ChatTime time={time} />
      </div>
    </div>
  );
};

export default AdminMessage;
