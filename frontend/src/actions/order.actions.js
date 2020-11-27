import axios from "axios";
import { logout } from "./user.actions";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: "ORDER_CREATE_REQUEST",
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/orders", order, config);

    dispatch({
      type: "ORDER_CREATE_SUCCESS",
      payload: data,
    });
    dispatch({
      type: "CART_CLEAR_ITEMS",
      payload: data,
    });
    dispatch({ type: "MY_ORDERS_RESET" });
    localStorage.removeItem("cartItems");
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: "ORDER_CREATE_FAIL",
      payload: message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: "ORDER_DETAILS_REQUEST",
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch({
      type: "ORDER_DETAILS_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ORDER_DETAILS_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const payOrder = (ORDER_ID, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: "ORDER_PAY_REQUEST",
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/orders/${ORDER_ID}/pay`,
      paymentResult,
      config
    );

    dispatch({
      type: "ORDER_PAY_SUCCESS",
      payload: data,
    });
    dispatch({ type: "MY_ORDERS_RESET" });
  } catch (error) {
    dispatch({
      type: "ORDER_PAY_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: "MY_ORDERS_REQUEST",
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/myorders`, config);

    dispatch({
      type: "MY_ORDERS_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "MY_ORDERS_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: "ORDERS_LIST_REQUEST",
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders`, config);

    dispatch({
      type: "ORDERS_LIST_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ORDERS_LIST_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: "ORDER_DELIVER_REQUEST",
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/orders/${order._id}/deliver`,
      {},
      config
    );

    dispatch({
      type: "ORDER_DELIVER_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ORDER_DELIVER_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
