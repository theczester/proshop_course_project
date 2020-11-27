import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomeScreen from "./Screens/Home.screen.jsx";
import ProductScreen from "./Screens/Product.screen.jsx";
import CartScreen from "./Screens/Cart.screen.jsx";
import LoginScreen from "./Screens/Login.screen.jsx";
import RegisterScreen from "./Screens/Register.screen.jsx";
import ProfileScreen from "./Screens/Profile.screen.jsx";
import ShippingScreen from "./Screens/Shipping.screen.jsx";
import PaymentScreen from "./Screens/Payment.screen.jsx";
import PlaceOrderScreen from "./Screens/PlaceOrder.screen.jsx";
import OrderScreen from "./Screens/Order.screen.jsx";
import UserListScreen from "./Screens/UserList.screen.jsx";
import UserEditScreen from "./Screens/UserEdit.screens.jsx";
import ProductListScreen from "./Screens/ProductList.screen.jsx";
import ProductEditScreen from "./Screens/ProductEdit.screen.jsx";
import OrderListScreen from "./Screens/OrdersList.screen.jsx";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/admin/order/:id" component={OrderScreen} />
          <Route path="/placeorder" component={PlaceOrderScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/product/:id" component={ProductScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
          <Route path="/admin/orderlist" component={OrderListScreen} />
          <Route path="/admin/product/:id/edit" component={ProductEditScreen} />
          <Route
            exact
            path="/admin/productlist/:pageNumber"
            component={ProductListScreen}
          />
          <Route
            exact
            path="/admin/productlist"
            component={ProductListScreen}
          />
          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
          <Route path="/admin/userlist" component={UserListScreen} />
          <Route exact path="/search/:keyword" component={HomeScreen} />
          <Route
            path="/search/:keyword/page/:pageNumber"
            component={HomeScreen}
          />
          <Route path="/page/:pageNumber" component={HomeScreen} />
          <Route exact path="/" component={HomeScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
