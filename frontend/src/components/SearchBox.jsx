import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchBox = () => {
  let query = useQuery();
  const filterBy = query.get("filterBy") || "";
  const sortBy = query.get("sortBy") || "";
  const hideSoldOut = query.get("hideSoldOut") || false;

  const [keyword, setKeyword] = useState("");

  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(
        `/search/${keyword}?filterBy=${filterBy}&sortBy=${sortBy}&hideSoldOut=${hideSoldOut}`
      );
    } else {
      history.push(
        `/?filterBy=${filterBy}&sortBy=${sortBy}&hideSoldOut=${hideSoldOut}`
      );
    }
  };
  return (
    <Form onSubmit={(e) => handleSearch(e)} style={{ display: "flex" }}>
      <Form.Control
        className="mr-sm-2 search-box"
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search 
        Product..."
      />
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
