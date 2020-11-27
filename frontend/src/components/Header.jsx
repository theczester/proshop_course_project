import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useMediaQuery } from "react-responsive";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import SearchBox from "./SearchBox.jsx";
import SearchFilters from "./SearchFilters.jsx";
import { logout } from "../actions/user.actions";

const Header = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const NavbarComponent = () => (
    <>
      <LinkContainer to="/">
        <Navbar.Brand>ProShop</Navbar.Brand>
      </LinkContainer>
      <SearchBox />
      <SearchFilters />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <LinkContainer to="/cart">
            <Nav.Link>
              <i className="fas fa-shopping-cart" /> Cart
            </Nav.Link>
          </LinkContainer>
          {userInfo ? (
            <NavDropdown title={userInfo.name} id="username">
              <LinkContainer to="/profile">
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <LinkContainer to="/login">
              <Nav.Link>
                <i className="fas fa-user" /> Sign In
              </Nav.Link>
            </LinkContainer>
          )}
          {userInfo && userInfo.isAdmin && (
            <NavDropdown title="Admin" id="adminmenu">
              <LinkContainer to="/admin/userlist">
                <NavDropdown.Item>Users</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/productlist">
                <NavDropdown.Item>Products</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/orderlist">
                <NavDropdown.Item>Orders</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </>
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header>
      {isDesktopOrLaptop ? (
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <NavbarComponent />
          </Container>
        </Navbar>
      ) : (
        <>
          <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            collapseOnSelect
            id="responsive-nav"
          >
            <NavbarComponent />
          </Navbar>
        </>
      )}
    </header>
  );
};

export default Header;
