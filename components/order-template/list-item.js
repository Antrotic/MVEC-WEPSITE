import React from "react";
import PencilLineIcon from "remixicon-react/PencilLineIcon";
import { Table } from "reactstrap";
import moment from "moment";
import useQueryParams from "../../hooks/useQueryParams";

// getStatus(): "active" | "expired" | "idle"
const getStatus = (date) => {
  const today = new Date();
  today.setHours(5, 0, 0, 0);

  const startDate = new Date(date?.start_date);
  const endDate = new Date(date?.end_date);

  if (startDate <= today && today < endDate) return "active";
  if (endDate <= today) return "expired";
  return "idle";
};

const ListItem = ({ autoOrder, updateAutoOrder }) => {
  const { order, date } = autoOrder;
  const status = getStatus(date);
  const { changeQueryParams } = useQueryParams();
  const handleClick = (id) => {
    changeQueryParams({ orderId: id });
    // setVisible(true);
    // setCurrentOrderId(id);
  };

  const onUpdateAutoOrder = (e) => {
    e.stopPropagation();
    updateAutoOrder(autoOrder);
  };
  return (
    <>
      <div className='list-item' onClick={() => handleClick(order.id)}>
        <div className='item'>{`#${order.id}`}</div>
        <div className='item'>
          <div className='products'>
            <div className='total-count'>
              <div>
                {date ? (
                  <>
                    <Table bordered className='mb-0 theme-text-black'>
                      <tr>
                        <td className='fs-7'>
                          {moment(date.start_date).format("MMMM, Do. yyyy") +
                            "y."}
                        </td>
                      </tr>
                      <tr>
                        <td className='fs-7'>
                          {moment(date.end_date).format("MMMM, Do. YYYY") +
                            "y."}
                        </td>
                      </tr>
                    </Table>
                  </>
                ) : (
                  "... - ..."
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='item'>
          <div className='amount'>
            {`${order.currency?.symbol || "$"} ${order?.price?.toFixed(2)}`}
          </div>
        </div>
        <div className='item'>
          <div className='date-time'>
            {status === "active" ? (
              <span onClick={onUpdateAutoOrder} className='badge bg-success'>
                Active &nbsp; <PencilLineIcon size={15} />
              </span>
            ) : status === "expired" ? (
              <span className='badge bg-danger'>Expired</span>
            ) : (
              <span className='badge bg-info'>Idle</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListItem;
