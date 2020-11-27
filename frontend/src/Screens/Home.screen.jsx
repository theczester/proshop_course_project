import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product.jsx";
import { useLocation } from "react-router-dom";
import Meta from "../components/Meta.jsx";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import Paginate from "../components/Paginate.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
import { listProducts } from "../actions/product.actions";
import { validateProduct } from "../utils.js";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const HomeScreen = ({ match, history }) => {
  let query = useQuery();

  const filterBy = query.get("filterBy") || "";
  const sortBy = query.get("sortBy") || "";
  const initialHideSoldOut = query.get("hideSoldOut")
    ? query.get("hideSoldOut") === "true"
      ? true
      : false
    : false;

  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const [hideSoldOut, setHideSoldOut] = useState(initialHideSoldOut);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, filterBy, sortBy));
  }, [dispatch, keyword, pageNumber, filterBy, sortBy, hideSoldOut]);

  useEffect(() => {
    history.push(
      keyword
        ? `/search/${keyword}/page/${pageNumber}/?filterBy=${filterBy}&sortBy=${sortBy}&hideSoldOut=${hideSoldOut}`
        : `/page/${pageNumber}/?filterBy=${filterBy}&sortBy=${sortBy}&hideSoldOut=${hideSoldOut}`
    );
    // eslint-disable-next-line
  }, [hideSoldOut]);

  useEffect(() => {
    dispatch({ type: "PRODUCT_DETAILS_RESET" });
  }, [dispatch]);

  return (
    <>
      <Meta title={keyword ? `Results for ${keyword}` : "Welcome to ProShop"} />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link
          to={`/?filterBy=${filterBy}&sortBy=${sortBy}&hideSoldOut=${hideSoldOut}`}
          className="btn btn-dark"
        >
          Go back
        </Link>
      )}
      <div className="display-flex mt-4">
        <h1>Latest Products</h1>
        <Form>
          <Form.Check
            className="form form-control-lg ml-4"
            type="checkbox"
            label="Hide sold out products"
            checked={hideSoldOut}
            onChange={(e) => setHideSoldOut(e.target.checked)}
          />
        </Form>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <>
                {validateProduct(product, hideSoldOut) && (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                )}
              </>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
