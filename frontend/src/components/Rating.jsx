import React from "react";

const Rating = ({ value, numOfReviews, color = "#f8e825" }) => {
  value = Math.floor(value);
  return (
    <div className="rating">
      {[...Array(5)].map((_, i) => (
        <>
          {i + 1 <= value ? (
            <i className="fas fa-star" key={i} style={{ color }} />
          ) : (
            <i className="fas fa-star" key={i} style={{ color: "lightgrey" }} />
          )}
        </>
      ))}
      {Math.floor(value) !== value && (
        <i className="fas fa-star-half-alt" style={{ color }} />
      )}
      {numOfReviews && <span>{numOfReviews} reviews</span>}
    </div>
  );
};

export default Rating;
