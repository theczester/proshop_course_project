import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { formatDate } from "../utils";
import { listOrders } from "../actions/order.actions";
import Meta from "../components/Meta.jsx";

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const ordersList = useSelector((state) => state.ordersList);
  const { loading, error, orders } = ordersList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <Meta title="Admin | Orders list" description="See all orders" />
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered responsive hover className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    formatDate(order.paidAt)
                  ) : (
                    <i className="fas fa-times red-i bigger-i" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    formatDate(order.deliveredAt)
                  ) : (
                    <i className="fas fa-times red-i bigger-i" />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
