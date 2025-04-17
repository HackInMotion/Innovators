import React from "react";
import Carousel from "../components/Carousel";
import HeroImage from "../components/HeroImage";
import Categories from "../components/Categories";
import AllCategories from "../components/AllCategories";

const Home = () => {
  return (
    <>
      <Carousel />
      <AllCategories/>
      <HeroImage />
    </>
  );
};

export default Home;
