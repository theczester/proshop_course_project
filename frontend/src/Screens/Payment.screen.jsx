import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer.jsx";
import CheckoutSteps from "../components/CheckoutSteps.jsx";
import Meta from "../components/Meta.jsx";
import { savePaymentMethod } from "../actions/cart.actions";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const handleContinue = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };
  return (
    <>
      <Meta
        title="Select Payment Service"
        description="Choose a payment method"
      />
      <FormContainer>
        <CheckoutSteps currentStep={3} />
        <h1>Payment Method</h1>
        <Form onSubmit={(e) => handleContinue(e)}>
          <Form.Group>
            <Form.Label as="legend">Select method</Form.Label>
            <Col>
              <Form.Check
                className="mt-3 mb-5"
                type="radio"
                label="PayPal or Credit Card"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary">
            Confirm
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
