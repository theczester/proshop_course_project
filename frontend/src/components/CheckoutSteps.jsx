import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ currentStep }) => {
  let location = useLocation();
  const steps = [
    { header: "Sign In", link: `/login?redirect=${location.pathname}` },
    { header: "Shipping", link: "/shipping" },
    { header: "Payment", link: "/payment" },
    { header: "Place Order", link: "/placeorder" },
  ];

  return (
    <Nav className="justify-content-center mb-4">
      {[...Array(steps.length).keys()].map((step) => (
        <Nav.Item key={step}>
          {currentStep >= step + 1 ? (
            <LinkContainer to={steps[step].link}>
              <Nav.Link>{steps[step].header}</Nav.Link>
            </LinkContainer>
          ) : (
            <Nav.Link disabled>{steps[step].header}</Nav.Link>
          )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default CheckoutSteps;
