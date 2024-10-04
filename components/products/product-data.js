import React, {useContext, useState} from "react";
import PriceTag3FillIcon from "remixicon-react/PriceTag3FillIcon";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import Message2FillIcon from "remixicon-react/Message2FillIcon";
import Heart3LineIcon from "remixicon-react/Heart3LineIcon";
import Heart3FillIcon from "remixicon-react/Heart3FillIcon";
import {useTranslation} from "react-i18next";
import {getPrice} from "../../utils/getPrice";
import {addToSaved, removeFromSaved} from "../../redux/slices/savedProduct";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import AddLineIcon from "remixicon-react/AddLineIcon";
import SubtractLineIcon from "remixicon-react/SubtractLineIcon";
import {OrderContext} from "../../context/OrderContext";
import SummaryProduct from "./summary-product";
import ProductShare from "../productShare/productShare";
import InputPhone from "../form/form-item/InputPhone";
import MessageInput from "../form/form-item/msg-input";
import {PhoneApi} from "../../api/main/phone";
import {toast} from "react-toastify";
import PaymentSelect from "../paymentSelect";
import useModal from "../../hooks/useModal";
import {parseCookies} from "nookies";
import {CartApi} from "../../api/main/cart";
import {OrderApi} from "../../api/main/order";
import {TransactionsApi} from "../../api/main/transactions";
import {useRouter} from "next/router";
import {Button, Modal, Spinner, ModalBody, ModalFooter} from "reactstrap";
import {MainContext} from "../../context/MainContext";

function ProdctData({setVisible, product}) {
    const {t: tl} = useTranslation();
    const dispatch = useDispatch();
    const { handleAuth } = useContext(MainContext);
    const likedProducts = useSelector(
        (state) => state.savedProduct.savedProductList
    );
    const router = useRouter()
    const cart = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user.data, shallowEqual);
    const shop = useSelector((state) => state.stores.currentStore, shallowEqual);

    const savedProduct = likedProducts.find((item) => item.id === product.id);
    const [open, handleOpen, handleClose] = useModal();
    const currentProduct = cart.cartItems.find(
        (item) => item?.id === product?.id
    );
    const cookies = parseCookies();
    const [giftCardOrderData, serGiftCardOrderData] = useState({});

    const {decrease, increase, handleAddToCart} = useContext(OrderContext);

    const isGiftCard = product.product.gift === 1;

    // payment select
    const [selectedPayment, setSelectedPayment] = useState({});
    const [calculateResult, setCalculateResult] = useState({});

    const [loadingState, setLoadingState] = useState({cancel: false, continue: false, sendGift: false});

    const handlePayment = (e) => {
        setSelectedPayment(e.payment);
    };

    const searchUserByPhone = async () => {
        try {
            const res = await PhoneApi.checkPhone({phone: giftCardOrderData.phone});
            if (!res.data.exist) {
                toast.error("Phone number not found");
                return false;
            }
            return res?.data?.user?.id;
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
            return false;
        }
    };

    const createGiftOrder = async (cart_id, userId) => {
        try {

            if (selectedPayment.tag === "wallet" && parseFloat(user?.wallet?.price) <
                parseFloat(calculateResult.order_total)) {
                toast.error("You don't have enough funds in your wallet");
                return;
            }

            setLoadingState(prevState => ({...prevState, continue: true}))
            const orderRes = await OrderApi.create({
                cart_id,
                currency_id: cookies.currency_id,
                shop_id: shop.id,
                rate: cookies.currency_rate,
                note: giftCardOrderData.note,
                gift: 1,
                gift_user_id: userId
            })
            await TransactionsApi.create(orderRes.data.id, {
                payment_sys_id: selectedPayment.id,
            })
            toast.success('Gift card sent!');
            handleClose()
            await router.push(`/stores/${shop.slug}`);
        } catch (e) {
            toast.error(e.message)
            console.error(e)
        } finally {
            setLoadingState(prevState => ({...prevState, continue: false}))
        }
    }

    const cancelGiftOrder = async (cart_id) => {
        try {
            setLoadingState(prevState => ({...prevState, cancel: true}))
            await CartApi.delete(cart_id);
            handleClose()
        } catch (e) {
            toast.error(e.message);
            console.error(e)
        } finally {
            setLoadingState(prevState => ({...prevState, cancel: false}))
        }
    }

    const handleBuyGiftCard = async () => {
        console.log('cookies.access_token', cookies.access_token)
        if(!cookies.access_token) {
            toast.error('Please login first')
            return  handleAuth('login')
        }
        try {
            if (!selectedPayment?.id) return toast.error('Select payment type');
            setLoadingState((prev) => ({...prev, sendGift: true}))
            const userId = await searchUserByPhone();
            if (!userId) return;

            const cartRes = await CartApi.create({
                shop_id: shop?.id,
                shop_product_id: product.id,
                quantity: 1,
                currency: cookies.currency_id,
            });
            const calcRes = await CartApi.calculate(cartRes.data.id, {currency_id: cookies.currency_id});
            setCalculateResult({...calcRes.data, cart_id: cartRes.data.id, user_id: userId});
            handleOpen();

        } catch (e) {
            console.error(e);
            toast.error('Something went wrong')
        } finally {
            setLoadingState(prevState => ({...prevState, sendGift: false}))
        }
    }

    return (
        <div className='product-detail-data'>
            {isGiftCard && <h2 className='gift-card-title'>Gift Card</h2>}
            {Boolean(product?.discount) && (
                <div className='sale'>
                    <div className='icon'>
                        <PriceTag3FillIcon size={16}/>
                    </div>
                    <div className='label'>
                        {`${tl("Sale")} ${(
                            (product?.discount / product?.price) *
                            100
                        ).toFixed(1)} % — ${getPrice(product?.discount)} off`}
                    </div>
                </div>
            )}
            <div className='product-name'>{product?.product.translation.title}</div>
            <div className='review-box'>
                <div className='score item'>
                    <div className='icon'>
                        <StarSmileFillIcon size={16}/>
                    </div>
                    <div className='label'>
                        {product?.rating_avg ? product.rating_avg.toFixed(1) : "0.00"}
                    </div>
                </div>
                <div className='review item'>
                    <div className='icon'>
                        <Message2FillIcon size={16}/>
                    </div>
                    <div className='label'>{`${product?.reviews?.length} reviews`}</div>
                </div>
                <div className='comment-btn item' onClick={() => setVisible(true)}>
                    <div className='icon'>
                        <Message2FillIcon size={16}/>
                    </div>
                    <div className='label'>{tl("Add comment")}</div>
                </div>
            </div>
            <div className='price'>
                <div className='current-old'>
                    {product?.discount ? (
                        <>
                            <div className='current-price'>
                                {getPrice(product?.price - product?.discount)}
                            </div>
                            <div className='old-price'>{getPrice(product?.price)}</div>
                        </>
                    ) : (
                        <div className='current-price'>{getPrice(product?.price)}</div>
                    )}
                </div>
                {!isGiftCard && (
                    <div className='availability'>
                        <div className='name'>{tl("Availabity — ")} </div>
                        <div className='link'>{`${
                            product?.quantity >= 0
                                ? product?.quantity +
                                ` ${product.product.unit?.translation?.title}` +
                                tl(" in stock")
                                : tl("out of stock")
                        }`}</div>
                    </div>
                )}
            </div>
            {isGiftCard && (
                <div className='my-3'>
                    <h5 className='gift-card-from-label'>Enter your gift card details</h5>
                    <InputPhone
                        onChange={(e) =>
                            serGiftCardOrderData((prev) => ({
                                ...prev,
                                phone: e.target.value.replace(/[^\d\+]/g, ""),
                            }))
                        }
                        name='phone_to'
                        label='phone'
                    />
                    <MessageInput
                        label
                        placeholder='Gift card message'
                        value={giftCardOrderData.note}
                        onChange={(e) =>
                            serGiftCardOrderData((prev) => ({
                                ...prev,
                                note: e.target.value,
                            }))
                        }
                    />
                    <PaymentSelect disableCash handlePayment={handlePayment} selectedPayment={selectedPayment}/>
                    <Modal
                        isOpen={open}
                        onHide={handleClose}
                        className='address-modal'
                        centered={true}
                        title='Gift card total'
                        backdrop="static"
                    >
                        <ModalBody>
                            <div className="d-block mt-5">
                                <ul className='p-0 theme-text-black'>
                                    <li className="d-flex align-items-center justify-content-between border-bottom ">
                                        <span>Gift Price</span>
                                        <span
                                            className="h5 fw-bolder my-1">{getPrice(calculateResult.product_total)}</span>
                                    </li>
                                    <li className="d-flex align-items-baseline justify-content-between border-bottom">
                                        <span>Shop tax</span>
                                        <span className="h5 fw-bolder my-1">{getPrice(calculateResult.order_tax)}</span>
                                    </li>
                                    <li className="d-flex align-items-baseline justify-content-between border-bottom">
                                        <span>VAT tax</span>
                                        <span
                                            className="h5 fw-bolder my-1">{getPrice(calculateResult.product_tax)}</span>
                                    </li>
                                    <li className="d-flex align-items-baseline justify-content-between border-bottom">
                                        <span>Total amount</span>
                                        <span
                                            className="h5 fw-bolder my-1">{getPrice(calculateResult.order_total)}</span>
                                    </li>
                                </ul>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button disabled={loadingState.continue} color="primary" onClick={() => {
                                createGiftOrder(calculateResult.cart_id, calculateResult.user_id)
                            }}>
                                Continue {loadingState.continue &&
                                <Spinner size="sm" color="light">
                                    Loading...
                                </Spinner>
                            }
                            </Button>{' '}
                            <Button className='theme-text-black' outline disabled={loadingState.cancel} color="secondary"
                                    onClick={() => cancelGiftOrder(calculateResult.cart_id)}>
                                Cancel {loadingState.cancel &&
                                <Spinner size="sm" color="secondary">
                                    Loading...
                                </Spinner>
                            }
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )}
            <div className='btn-box'>
                {currentProduct ? (
                    isGiftCard ? (
                        <div className='inc-dec justify-content-center'>
                            <span>Gift added to the card</span>
                        </div>
                    ) : (
                        <div className='inc-dec'>
                            <button
                                className='inc'
                                onClick={() =>
                                    decrease({
                                        ...product,
                                        user_cart_uuid: currentProduct?.user_cart_uuid,
                                    })
                                }
                            >
                                <SubtractLineIcon/>
                            </button>
                            <span>{`${currentProduct?.qty} ${
                                product.product.unit?.translation?.title
                            } ${tl(" in cart")}`}</span>
                            <button
                                className='dec'
                                onClick={() =>
                                    increase({
                                        ...product,
                                        user_cart_uuid: currentProduct?.user_cart_uuid,
                                    })
                                }
                            >
                                <AddLineIcon/>
                            </button>
                        </div>
                    )
                ) : (
                    <button
                        disabled={(isGiftCard && loadingState.sendGift) || (product?.quantity >= product?.min_qty ? false : true)}
                        className='add-to-card'
                        onClick={async () => {
                            if (isGiftCard) {
                                await handleBuyGiftCard()
                                return;
                            }
                            handleAddToCart(product);
                        }}
                    >
                        {product?.quantity >= product?.min_qty
                            ? isGiftCard
                                ? <>{tl("Send the gift")} {loadingState.sendGift && <Spinner size="sm" color="light">
                                    Loading...
                                </Spinner>}</>
                                : tl("Add to cart")
                            : tl("out of stock")}
                    </button>
                )}
                <div className='like-btn'>
                    {savedProduct?.id === product?.id ? (
                        <Heart3FillIcon
                            size={24}
                            color='#DE1F36'
                            onClick={() => dispatch(removeFromSaved(product))}
                        />
                    ) : (
                        <Heart3LineIcon
                            size={24}
                            onClick={() => dispatch(addToSaved(product))}
                        />
                    )}
                </div>
                <div className='like-btn'>
                    <ProductShare data={product}/>
                </div>
            </div>
            {product?.bonus?.status && (
                <div className='bonus'>
                    <h4>{tl("Bonus Product:")}</h4>
                    <SummaryProduct
                        data={product?.bonus?.bonus_product}
                        isBonus={true}
                        qty={product?.bonus?.bonus_quantity}
                    />
                </div>
            )}
        </div>
    );
}

export default ProdctData;
