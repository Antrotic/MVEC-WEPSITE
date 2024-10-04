import { getPrice } from "../../utils/getPrice";
import ArrowDownLineIcon from "remixicon-react/ArrowDownLineIcon";
import ArrowUpLineIcon from "remixicon-react/ArrowUpLineIcon";
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Collapse,
  Spinner,
} from "reactstrap";
import { savedUser } from "../../redux/slices/user";
import { UserApi } from "../../api/main/user";
import { toast } from "react-toastify";
import {useDispatch} from "react-redux";

const ListItem = ({ moneyRequest, openModalHandler, fetchMoneyRequests }) => {
  const [isLoading, setIsLoading] = useState({ status: "", value: false });
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const displayUser = moneyRequest.own
    ? moneyRequest.response_user
    : moneyRequest.request_user;
  const handleRequest = async (id, status) => {
    try {
      setIsLoading({ status, value: true });
      await UserApi.changeStatusWalletRequest(id, { status });
      if(status === 'approved') reloadWallet();
      toast.success(`Money request ${status}`);
    } catch (e) {
      console.error(e);
      toast.error(e.response.data.message || e.message);
    } finally {
      setIsLoading({ status: "", value: false });
      fetchMoneyRequests();
    }
  };

  const reloadWallet = () => {
    UserApi.get()
        .then((res) => {
          dispatch(savedUser(res.data));
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message || error.message)
        })
  };
  return (
    <>
      <div>
        <div className='list-item'>
          <div className='item'>{displayUser.phone}</div>
          <div className='item'>
            <div className='products'>
              <div className='total-count'>
                <div>{displayUser.firstname}</div>
              </div>
            </div>
          </div>
          <div className='item'>
            <div className='amount'>{getPrice(moneyRequest?.price)}</div>
          </div>
          <div className='item'>
            <div className='date-time'>
              {moneyRequest.status === "pending" ? (
                <span className='badge bg-info'>Pending</span>
              ) : moneyRequest.status === "rejected" ? (
                <span className='badge bg-danger'>Rejected</span>
              ) : (
                <span className='badge bg-success'>Approved</span>
              )}
            </div>
          </div>
          <div className='item'>
            <ButtonGroup>
              {moneyRequest.status === "pending" &&
                (moneyRequest.own ? (
                  <>
                    {moneyRequest.status === "pending" && (
                      <Button
                        onClick={() =>
                          openModalHandler({
                            modalEventType: "Edit",
                            requestId: moneyRequest.id,
                          })
                        }
                        outline
                        color='primary'
                      >
                        Edit
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      disabled={isLoading.value}
                      onClick={() => handleRequest(moneyRequest.id, "approved")}
                      color='primary'
                      outline
                      className='d-flex align-items-center gap-1'
                    >
                      Approve{" "}
                      {isLoading.status === "approved" && isLoading.value && (
                        <Spinner color='primary' size='sm'>
                          Loading...
                        </Spinner>
                      )}
                    </Button>
                    <Button
                      disabled={isLoading.value}
                      onClick={() => handleRequest(moneyRequest.id, "rejected")}
                      color='danger'
                      outline
                      className='d-flex align-items-center gap-1'
                    >
                      Reject{" "}
                      {isLoading.status === "rejected" && isLoading.value && (
                        <Spinner color='danger' size='sm'>
                          Loading...
                        </Spinner>
                      )}
                    </Button>
                  </>
                ))}
              {moneyRequest.own && (
                <Button
                  onClick={() =>
                    openModalHandler({
                      modalEventType: "Delete",
                      requestId: moneyRequest.id,
                    })
                  }
                  color='danger'
                  outline
                >
                  Delete
                </Button>
              )}
            </ButtonGroup>
          </div>
          {moneyRequest.own ? (
            <ArrowUpLineIcon className='text-success' />
          ) : (
            <ArrowDownLineIcon className='text-danger' />
          )}
        </div>
        {moneyRequest?.message && (
          <Card>
            <span
              onClick={() => setIsOpen((prev) => !prev)}
              role='button'
              className='text-center'
            >
              {isOpen ? "Hide" : "Show"} message
            </span>
            <Collapse isOpen={isOpen}>
              <CardBody>
                <p>{moneyRequest?.message}</p>
              </CardBody>
            </Collapse>
          </Card>
        )}
      </div>
    </>
  );
};

export default ListItem;
