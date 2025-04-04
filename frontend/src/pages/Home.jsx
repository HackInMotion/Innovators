import React from "react";
import Carousel from "../components/Carousel";
import ForumPage from "./FourmPage";
import HeroImage from "../components/HeroImage";
import BotpressChat from "../components/BotPress";

const Home = () => {
  return (
    <>
      <Carousel />
      <HeroImage />
      <ForumPage />
      <BotpressChat />
    </>
  );
};

export default Home;
