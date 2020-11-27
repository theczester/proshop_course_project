import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome To ProShop",
  keywords:
    "Iphone, apple, electronics, computers, air purifier, xiaomi, PC, gaming, gamer, mouse, keyboard, screen, airpods, alexa ",
  description: "Buy the best products for the best price!",
};

export default Meta;
