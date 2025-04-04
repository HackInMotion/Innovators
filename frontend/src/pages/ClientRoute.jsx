import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientLayout from "./ClientLayout";
import Home from "./Home";
import AboutUs from "./aboutus";
import ContactUs from "./contactus";
import Communities from "./communities";
import Courses from "./courses";

const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/contact" element={<ContactUs />} />
      </Route>
    </Routes>
  );
};

export default ClientRoute;
