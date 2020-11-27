import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../utils";
import Rating from "../components/Rating.jsx";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import Meta from "../components/Meta.jsx";
import {
  listProductDetails,
  createProductReview,
} from "../actions/product.actions";
import { Link } from "react-router-dom";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviewSent, setReviewSent] = useState(false);

  const PRODUCT_ID = match.params.id;

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successCreateReview,
    error: errorCreateReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successCreateReview) {
      setReviewSent(true);
      setRating("");
      setComment("");
      dispatch({ type: "PRODUCT_CREATE_REVIEW_RESET" });
    }

    dispatch(listProductDetails(PRODUCT_ID));
  }, [dispatch, PRODUCT_ID, successCreateReview]);

  const handleAddToCart = () => {
    history.push(`/cart/${PRODUCT_ID}?qty=${qty}`);
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return (
    <>
      <Button onClick={() => history.goBack()} className="btn btn-dark my-3">
        Go back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta
            title={product.name}
            keywords={product.name}
            description={product.description}
          />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  {product.rating && (
                    <Rating
                      value={product.rating}
                      numOfReviews={product.numReviews}
                    />
                  )}
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In stock" : "Out of stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            style={{ minWidth: "5rem" }}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (n) => (
                                <option key={n + 1} value={n + 1}>
                                  {n + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={handleAddToCart}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add to cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {errorCreateReview && (
                <Message variant="danger">{errorCreateReview}</Message>
              )}
              {product.reviews.length === 0 && (
                <Message>Be the first one to review this product!</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{formatDate(review.createdAt)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a review</h2>
                  {reviewSent && (
                    <Message variant="success">Review sent!</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={handleCreateReview}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Send
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please{" "}
                      <Link className="a-ul" to="/login">
                        sign in
                      </Link>{" "}
                      to leave a review!
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
