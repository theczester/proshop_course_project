import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader.jsx";
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from "../actions/order.actions";
import { addDecimals, formatDate } from "../utils";
import Meta from "../components/Meta";

const OrderScreen = ({ match, location, history }) => {
  const ORDER_ID = match.params.id;

  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);
  const [prices, setPrices] = useState([]);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading && prices.length === 0) {
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    setPrices([
      { name: "Items", price: order.itemsPrice },
      { name: "Shipping", price: order.shippingPrice },
      { name: "Tax", price: order.taxPrice },
      { name: "Total", price: order.totalPrice },
    ]);
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || order._id !== ORDER_ID || successDeliver) {
      dispatch({ type: "ORDER_PAY_RESET" });
      dispatch({ type: "ORDER_DELIVER_RESET" });
      dispatch(getOrderDetails(ORDER_ID));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    history,
    userInfo,
    ORDER_ID,
    successPay,
    order,
    successDeliver,
  ]);

  const handlePaymentSuccess = (paymentResult) => {
    dispatch(payOrder(ORDER_ID, paymentResult));
  };

  const handleDeliverOrder = () => {
    dispatch(deliverOrder(order));
  };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Meta title={`Order ${order._id}`} description="Order info and payment" />
      {location.pathname.slice(1, 6) === "admin" ? (
        <LinkContainer to="/admin/orderlist">
          <Button className="btn btn-dark mt-2 mb-4">See Order List</Button>
        </LinkContainer>
      ) : (
        <LinkContainer to="/profile">
          <Button className="btn btn-dark mt-2 mb-4">See all orders</Button>
        </LinkContainer>
      )}

      <h1 id="order-id-style">Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h5>Date: {formatDate(order.createdAt)}</h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {formatDate(order.deliveredAt)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {formatDate(order.paidAt)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={3} sm={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              {prices.map((price) => (
                <ListGroup.Item>
                  <Row>
                    <Col>{price.name}</Col>
                    <Col>${price.price}</Col>
                  </Row>
                </ListGroup.Item>
              ))}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={() => handleDeliverOrder()}
                    >
                      Mark as delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
