import React from "react";
import Refund2LineIcon from "remixicon-react/Refund2LineIcon";
import EyeLineIcon from "remixicon-react/EyeLineIcon";
import useQueryParams from "../../hooks/useQueryParams";
const ListItem = ({
  order,
  setVisible,
  setCurrentOrderId,
  activeTab,
  setModal,
  setModalDetail,
}) => {
  const { changeQueryParams } = useQueryParams();
  const handleClick = (id) => {
    changeQueryParams({ orderId: id });
    // setVisible(true);
    // setCurrentOrderId(id);
  };
  const handleRefund = (e) => {
    e.stopPropagation();
    setModal(true);
    setCurrentOrderId(order.id);
  };
  const handleRefundDetail = (e) => {
    e.stopPropagation();
    setModalDetail(order.refund.id);
    setCurrentOrderId(order.id);
  };
  return (
    <div className="list-item" onClick={() => handleClick(order.id)}>
      <div className="item">{`#${order.id}`}</div>
      <div className="item">
        <div className="products">
          <div className="total-count">
            {`${order?.order_details_count} Products`}
          </div>
        </div>
      </div>
      <div className="item">
        <div className="amount">{`${
          order.currency?.symbol || "$"
        } ${order?.price?.toFixed(2)}`}</div>
      </div>
      <div className="item">
        <div className="date-time">
          <span className="time">{order?.created_at?.slice(11, 16)}</span>
          <span className="date">{order?.created_at?.slice(0, 11)}</span>
        </div>
      </div>
      {activeTab === "delivered" &&
        (!order?.refund ? (
          <div className="item refund" onClick={(e) => handleRefund(e)}>
            <Refund2LineIcon />
          </div>
        ) : (
          <div className="item refund" onClick={(e) => handleRefundDetail(e)}>
            <EyeLineIcon />
          </div>
        ))}
    </div>
  );
};

export default ListItem;
