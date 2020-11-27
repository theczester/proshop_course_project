import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Form } from "react-bootstrap";
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchFilters = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const isMobile = useMediaQuery({
    query: "(max-device-width: 650px)",
  });

  let query = useQuery();
  let history = useHistory();
  let location = useLocation();

  const initialFilterBy = query.get("filterBy");
  const initialSortBy = query.get("sortBy");

  const [selectValue, setSelectValue] = useState(
    initialFilterBy + initialSortBy || ""
  );
  const [filterBy, setFilterBy] = useState(initialFilterBy || "");
  const [sortBy, setSortBy] = useState(initialSortBy || "");

  const addToPath =
    location.pathname.slice(0, 5) === "/page" ||
    location.pathname.slice(0, 7) === "/search";

  useEffect(() => {
    if (addToPath) {
      history.push(
        `${location.pathname}?filterBy=${filterBy}&sortBy=${sortBy}`
      );
    }

    // eslint-disable-next-line
  }, [filterBy, sortBy]);

  const handleChange = (value) => {
    setSelectValue(value);
    if (value.slice(-3) === "asc") {
      setSortBy("asc");
      setFilterBy(value.slice(0, -3));
    } else {
      setSortBy("desc");
      setFilterBy(value.slice(0, -4));
    }
  };

  return addToPath ? (
    <Form id="filter-form">
      <Form.Control
        className={
          isDesktopOrLaptop ? "mr-2 ml-5" : isMobile ? "" : "mr-2 ml-5"
        }
        as="select"
        value={selectValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">No Filters</option>
        <option value="pricedesc">Price descending</option>
        <option value="priceasc">Price ascending</option>
        <option value="ratingdesc">Rating descending</option>
        <option value="ratingasc">Rating ascending</option>
        <option value="reviewsdesc">Reviews descending</option>
        <option value="reviewsasc">Reviews ascending</option>
      </Form.Control>
    </Form>
  ) : null;
};

export default SearchFilters;
